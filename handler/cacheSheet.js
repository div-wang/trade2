const { getSheetData } = require("./feishu");
// 读取飞书文档数据
const cacheData = async () => {
  await getOrderSheetData("ya");
  await getOrderSheetData("div");
  await getRankSheetData();
};

const getOrderSheetData = async (user) => {
  const { spreadsheet_token, sheet_id2 } = Configs.lark[user];
  const res = await getSheetData(spreadsheet_token, sheet_id2, "");
  const values = res.data.valueRange.values;
  const fieldArr = values[0];
  for (let index = 1; index < values.length; index++) {
    const arr = values[index];
    const childOrder = {};
    for (let j = 0; j < arr.length; j++) {
      childOrder[fieldArr[j]] = arr[j];
    }
    // 缓存数据
    childOrder.no = index;
    ChildOrderCache[user] = {};
    ChildOrderCache[user][childOrder.orderId] = childOrder;
  }
};

const getRankSheetData = async () => {
  const { spreadsheet_token, sheet_id } = Configs.lark.zzRank;
  const res = await getSheetData(spreadsheet_token, sheet_id, "");
  const values = res.data.valueRange.values;
  const fieldArr = values[0];
  for (let index = 1; index < values.length; index++) {
    const arr = values[index];
    const rankInfo = {};
    for (let j = 0; j < arr.length; j++) {
      rankInfo[fieldArr[j]] = arr[j];
    }
    // 缓存数据
    RankInfoCache[rankInfo["型号Id"]] = rankInfo;
  }
  RankInfoCache.index = values.length;
};

module.exports = cacheData;
