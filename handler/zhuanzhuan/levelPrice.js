const { modifySheetData, insertSheetData } = require("../feishu");
const detailPage = require("./detail");

const app = async () => {
  const newList = [];
  // 处理成数组
  for (const key in RankInfoCache) {
    // console.log(key)
    if (["index"].includes(key)) continue;
    const data = RankInfoCache[key];
    const sales = data["月销量"];
    if (sales < 1000) continue;
    newList.push(data);
    salesCache = sales;
  }
  // 月销量降序
  newList.sort((a, b) => b["月销量"] - a["月销量"]);
  // 抓取价格
  for (let index = 15; index < newList.length; index++) {
    console.log(index);
    const data = newList[index];
    const levelPriceData = await detailPage(data.url);
    console.log(levelPriceData)
    const newData = [JSON.stringify(levelPriceData)];
    const { spreadsheet_token, sheet_id } = Configs.lark.zzRank;
    const range = "G" + data.index + ":" + "G" + data.index;
    await modifySheetData(spreadsheet_token, sheet_id, range, [newData]);
    await sleep(3000, 5000);
  }
};

module.exports = app;
