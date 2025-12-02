/*
 * @Author: Div gh110827@gmail.com
 * @Date: 2025-10-26 21:35:47
 * @LastEditors: Div gh110827@gmail.com
 * @LastEditTime: 2025-12-01 23:12:19
 * @Description:
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");
const {
  getSpreadsheetSheets,
  getSheetData,
  findSheetData,
  modifySheetData,
  insertSheetData,
} = require("../feishu");

const filterPrams = {
  storage: {
    "64G": { value: "5196", style: "201", cmd: "params_new6651=511434" },
    "128G": { value: "4895", style: "201", cmd: "params_new6651=678741" },
    "256G": { value: "5048", style: "201", cmd: "params_new6651=678742" },
    "512G": { value: "5170", style: "201", cmd: "params_new6651=1080730" },
    "1T": { value: "4975", style: "201", cmd: "params_new6651=1081373" },
    "16G+1T": { value: "11396", style: "201", cmd: "params_new6651=881018" },
    "12G+256G": { value: "8119", style: "201", cmd: "params_new6651=1085068" },
    "16G+512G": { value: "8143", style: "201", cmd: "params_new6651=1093199" },
    "16G+256G": { value: "8114", style: "201", cmd: "params_new6651=1093399" },
    "8G+128G": { value: "8124", style: "201", cmd: "params_new6651=1084339" },
    "8G+256G": { value: "5230", style: "201", cmd: "params_new6651=1084341" },
    "12G+512G": { value: "8128", style: "201", cmd: "params_new6651=1084345" },
    "24G+1T": { value: "24808", style: "201", cmd: "params_new6651=1213326" },
  },
  sort: {
    general: { value: "sp00", style: "320", cmd: "sortpolicy=0" },
    now: { value: "sp5", style: "320", cmd: "sortpolicy=1" },
    desc: { value: "sp2", style: "320", cmd: "sortpolicy=2" },
    asc: { value: "sp3", style: "320", cmd: "sortpolicy=3" },
  },
  level: {},
};
class zhuanzhuan {
  // 构造方法（初始化实例属性）
  constructor(data) {
    for (const key in data) {
      this[key] = data[key];
    }
    for (const key in Configs.lark[data.user]) {
      this[key] = Configs.lark[data.user][key];
    }
    //子订单缓存数据
    this.childOrderCache = ChildOrderCache[this.user] || {};
    this.insertSheetNo = 1;
  }
  async initRequest(url) {
    // 创建 CookieJar 实例（自动管理 Cookie）
    const cookieJar = new CookieJar();
    const axiosWithCookie = wrapper(
      axios.create({
        jar: cookieJar,
        withCredentials: true, // 显式开启跨域携带 Cookie（Node.js 16 需明确设置）
      })
    );
    // 包装 axios 使其支持 CookieJar
    const cookieParts = this.cookies
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean);
    for (const cookie of cookieParts) {
      await cookieJar.setCookie(cookie, url); // 逐个添加，确保兼容性
    }
    return axiosWithCookie;
  }
  async requestUrl(url) {
    const request = await this.initRequest(url);
    return await request.get(url, {
      headers: this.headers,
    });
  }
  async requestFormUrl(url, data) {
    const request = await this.initRequest(url);
    return await request.post(url, data, {
      headers: this.headers,
    });
  }

  // 获取当前账号订单id列表， URL中tipId=2表示进行中订单， 1表示全部订单
  async getOrderIds() {
    return await this.requestUrl(
      `https://app.zhuanzhuan.com/zzx/transfer/getSellerOrders2?pageNum=1&pageSize=20&tipId=2&keyWords=&abGroup=2`
    ).then((res) => {
      const respData = res.data.respData;
      // console.log(res)
      if (respData && respData.orderList) {
        const arr = [];
        res.data.respData.orderList.forEach((order) => {
          arr.push(order.orderId);
        });
        return arr;
      }
    });
  }

  // 获取子订单列表，传参是订单id
  async getChildOrderIds(orderId) {
    return await this.requestUrl(
      `https://app.zhuanzhuan.com/zzopen/c2b_consignment/parentOrderDetail?parentOrderId=${orderId}`
    ).then(async (res) => {
      try {
        const data = res.data.respData || { childrenOrder: [] };
        const total = data.childrenOrder.length;
        for (let i = 0; i < total; i++) {
          const childOrder = data.childrenOrder[i];
          const childOrderId = childOrder.orderId;
          const orderCache = this.childOrderCache[childOrderId] || {};
          const status = childOrder.statusText.text;
          if (!orderCache.orderId) {
            await insertSheetData(
              this.spreadsheet_token,
              this.sheet_id2,
              this.insertSheetNo
            );
            this.insertSheetNo++;
          }
          if (status !== orderCache.status) {
            let childOrderInfo = ["质检中", "质检中断"].includes(status)
              ? { imei: "", amount: 0, subTitle: "", defect: "" }
              : await this.getChildOrderInfo(childOrderId, orderCache);
            const prantOrderId = orderId;
            const { imei, amount, subTitle, defect, qcCode } = childOrderInfo;
            const rangeIndex = orderCache.no
              ? orderCache.no + this.insertSheetNo
              : this.insertSheetNo;
            const range = "A" + rangeIndex + ":" + "H" + rangeIndex;
            const newData = [
              imei,
              status,
              amount,
              childOrderId,
              prantOrderId,
              qcCode,
              defect,
              subTitle,
            ];
            await modifySheetData(
              this.spreadsheet_token,
              this.sheet_id2,
              range,
              [newData]
            );
            // 修改拍机堂表格状态
            let orderChange;
            switch (status) {
              case "退回中":
                orderChange = {
                  row: "C",
                  val: "退回中",
                };
                break;
              case "出售中":
                orderChange = {
                  row: "J",
                  val: amount,
                };
                break;
              case "买家已拍下":
                orderChange = {
                  row: "C",
                  val: "已出售",
                };
                break;
              case "平台已发货":
                orderChange = {
                  row: "C",
                  val: "已出售",
                };
                break;
              case "买家申请退货":
                orderChange = {
                  row: "C",
                  val: "出售中",
                };
                break;
              case "已成交":
                orderChange = {
                  row: "C",
                  val: "已收款",
                };
                break;
              default:
                break;
            }
            if (orderChange) {
              const res = await findSheetData(
                imei,
                this.spreadsheet_token,
                this.sheet_id
              );
              const findArr = res.data.find_result.matched_cells;
              const findIndex = findArr[0] && findArr[0].slice(1);
              const range =
                orderChange.row + findIndex + ":" + orderChange.row + findIndex;
              const newData = [orderChange.val];
              if (findIndex) {
                // console.log('modifySheetData2',range, newData)
                await modifySheetData(
                  this.spreadsheet_token,
                  this.sheet_id,
                  range,
                  [newData]
                );
              }
            }
            // 打印日志
            Logger.info(childOrderId, imei, status, amount, subTitle);
          }
        }
      } catch (error) {
        Logger.error("error", "getChildOrderIds");
      }
    });
  }

  // 获取具体机器信息，包括imei等。具体机器作为子订单存在
  async getChildOrderInfo(childOrderId, oldOrderInfo) {
    return await this.requestUrl(
      `https://app.zhuanzhuan.com/zzopen/c2b_consignment/orderDetail?orderId=${childOrderId}&bizType=&bizStatus=`
    ).then(async (res) => {
      try {
        const data = res.data.respData;
        const qcCode = data.productInfo.qcCode || "";
        const imei = oldOrderInfo.imei || (await this.getIMEI(qcCode));
        const subTitle = data.titleInfo ? data.titleInfo.subTitle : "";
        const childOrderInfo = {
          amount: data.productPriceInfo
            ? data.productPriceInfo.totalPrice.amount / 100
            : 0,
          defect: "",
          qcCode,
          imei,
          orderId: childOrderId,
          subTitle,
        };
        // 验机不合格的具体信息
        if (data.defectReportInfo && data.defect === "") {
          childOrderInfo.defect = oldOrderInfo.defect + "||";
          data.defectReportInfo.itemInfo.forEach((item) => {
            childOrderInfo.defect += item.itemName + ":" + item.value + "; ";
          });
        }
        return childOrderInfo;
      } catch (error) {
        Logger.error("error", error);
        return "";
      }
    });
  }

  // 通过qcCode获取imei，imei是机器的唯一标识
  async getIMEI(qcCode) {
    return await axios
      .get(
        `https://app.zhuanzhuan.com/zzopen/zzbmmarketlogic/getAuctionQcReport?qcCode=${qcCode}`
      )
      .then((res) => {
        try {
          const list = res.data.respData.basicCheckListV2;
          const imei = list ? list[1].value : "";
          return imei;
        } catch (error) {
          Logger.error("error", error);
          return "";
        }
      });
  }

  // 获取产品型号排名数据
  async getRankInfo(data) {
    return await this.requestFormUrl(
      `https://app.zhuanzhuan.com/zzopen/hypermall/getSubRankInfo`,
      data
    ).then(async (res) => {
      try {
        // Logger.info(res.data)
        return res.data;
      } catch (error) {
        Logger.error("error", error);
        return "";
      }
    });
  }
  async getGoodsList({ sort = "desc", storage, modelId, brandId }) {
    const sorts = filterPrams.sort[sort];
    const storages = filterPrams.storage[storage];
    return await this.requestFormUrl(
      `https://app.zhuanzhuan.com/zzopen/ypmall/listData`,
      {
        param: JSON.stringify({
          showBatteryMore: true,
          ypFirstSearch: null,
          isShowGoodProductGoodPrice: true,
          filter: "5461:101;;keyword:;tab:0",
          pgCateInfo: "101",
          listInfoType: "fullInfo",
          initFrom: "G1001_sj_diamond_5816_6",
          secondFrom: "101_440",
          extraMetricInfo: "",
          labelIdList: "",
          pageIndex: 1,
          filterItems: {
            232: [
              { value: "28350", style: "117", cmd: "params_new13144=1214785" },
              { value: "28351", style: "117", cmd: "params_new13144=1214786" },
            ],
            69: [storages],
            st6: [
              {
                cmd: `pg_cate_brand_model=101,${brandId},0,${modelId}`,
                style: "209",
                value: `101,${brandId},0,${modelId}`,
                type: "model",
              },
            ],
            st7: [sorts],
          },
          listSearchType: "baseList",
          pageSize: 16,
          rstmark: Date.now(),
          firstFrom: "recommendRank",
          otherParams: { pgCate: "101,0,0", abLayer: "personalSupply" },
          tab: 0,
          listLayout: 1,
          redMetaId: "",
          activityZoneId: "",
          specialSubjectId: "",
          labelIdGroup: "",
          archiveid: "",
          archivemd5: "",
          promote: "100",
          paramsNew: "",
          recMarkType: 3,
          list930Type: 1,
          searchResultSource: 1,
          jrInfoId: "",
          sellerUid: "",
          openComparison: 1,
          jrCateParams: "[]",
          tabListWithOutFilter: 0,
          isNeedPriceAttention: false,
        }),
      }
    ).then(async (res) => {
      try {
        // Logger.info(res.data)
        return res.data;
      } catch (error) {
        Logger.error("error", error);
        return "";
      }
    });
  }
}

module.exports = zhuanzhuan;
