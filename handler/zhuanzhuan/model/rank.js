const { modifySheetData, insertSheetData } = require("../../feishu");
const zhuanzhuan = require("../index");
const rankIds = {
  总榜: 463,
  安卓: 6840,
  苹果: 440,
  华为: 441,
  小米: 445,
  红米: 443,
  vivo: 442,
  OPPO: 444,
  荣耀: 446,
  三星: 447,
  realme: 448,
  一加: 449,
  // 努比亚: 450,
  // 魅族: 451,
  // 黑鲨: 452,
  // 全部1000以下: 6421,
  // "全部1000-2000": 6422,
  // "全部2000-3000": 6423,
  // "全部3000-4000": 6424,
  // "全部4000-5000": 6425,
  // "全部5000-6000": 6426,
  // 全部6000以上: 6427,
  // 苹果1000以下: 6428,
  // "苹果1000-2000": 6429,
  // "苹果2000-4000": 6430,
  // "苹果4000-6000": 6431,
  // vivo1000以下: 6432,
  // "vivo1000-2000": 6433,
  // "vivo2000-4000": 6434,
  // 荣耀1000以下: 6449,
  // "荣耀1000-2000": 6450,
  // "荣耀2000-4000": 6451,
  // 荣耀4000以上: 6452,
  // 小米1000以下: 6446,
  // "小米1000-2000": 6447,
  // "小米2000-4000": 6448,
  // OPPO1000以下: 6442,
  // "OPPO1000-2000": 6443,
  // "OPPO2000-4000": 6444,
  // OPPO4000以上: 6445,
  // 华为1000以下: 6435,
  // "华为1000-2000": 6436,
  // "华为2000-4000": 6437,
  // "华为4000-6000": 6438,
  // 华为6000以上: 6439,
  // 红米1000以下: 6440,
  // "红米1000-2000": 6441,
  // 安卓1000以下: 6844,
  // "安卓1000-2000": 6845,
  // "安卓3000-4000": 6846,
  // "安卓4000-5000": 6847,
  // 安卓5000以上: 6848,
  // realme1000以下: 6864,
  // 畅玩游戏: 6860,
  // iPhone影像旗舰: 6583,
  // 安卓影像: 6420,
  // 安卓游戏: 6604,
  // iPhone准新机: 6838,
  // 华为准新机: 6850,
  小折叠屏: 683,
  大折叠屏: 682,
  //  折叠屏: 6935,
};
const { spreadsheet_token, sheet_id } = Configs.lark.zzRank;
const app = async () => {
  const config = Configs.zhuanzhuan.div;
  const zhuan = new zhuanzhuan(config);
  for (const key in rankIds) {
    const rankId = rankIds[key];
    const res = await zhuan.getRankInfo({
      tabToken: "qy01da601ec723b205288e2587b0_1703041199959",
      relationId: "22",
      platformType: "zz",
      refContent: "sjtab",
      rankIds: rankId,
      isFirst: true,
    });
    const rankList = res.respData && res.respData.subRankInfoList;
    const rankData = rankList && rankList[0];
    const list = rankData ? rankData.rankModelList : [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const { brandId, bottomPrice, clickUrl, modelId, modelSoldNum, name } = item;
      const rankInfo = {
        brandId,
        bottomPrice,
        clickUrl,
        modelId,
        modelSoldNum,
        name,
      };
      Logger.info(name);
      if (RankInfoCache[modelId]) {
        RankInfoCache[modelId]["月销量"] !== modelSoldNum
          ? await modifySheetDataProxy(RankInfoCache[modelId].index, "D", modelSoldNum)
          : "";
        RankInfoCache[modelId]["最低价"]  !== bottomPrice
          ? await modifySheetDataProxy(RankInfoCache[modelId].index, "E", bottomPrice)
          : "";
        await modifySheetDataProxy(RankInfoCache[modelId].index, "F", clickUrl)
      } else {
        await insertSheetData(spreadsheet_token, sheet_id, RankInfoCache.index);
        RankInfoCache.index += 1;
        await modifySheetDataProxy(RankInfoCache.index, "A", rankInfo, "F");
        RankInfoCache[rankInfo.modelId] = rankInfo;
      }
    }
  }
};

const modifySheetDataProxy = async (index, start, data, end) => {
  const range = start + index + ":" + (end || start) + index;
  const newData =
    typeof data === "object"
      ? [
          data.brandId,
          data.modelId,
          data.name,
          data.modelSoldNum,
          data.bottomPrice,
          data.clickUrl,
        ]
      : [data];
  await modifySheetData(spreadsheet_token, sheet_id, range, [newData]);
};

module.exports = app;
