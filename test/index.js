const {
  findSheetData,
  modifySheetData,
  insertSheetData,
} = require("../handler/feishu");
const getRankInfo = require("../handler/zhuanzhuan/rank");
const detailPage = require("../handler/zhuanzhuan/detail");
const levelPrice = require("../handler/zhuanzhuan/levelPrice");
const bidding = require("../handler/paijitang/bidding");

const app = async () => {
  // const {spreadsheet_token, sheet_id} = Configs.lark.ya
  // await modifySheetData(
  //   spreadsheet_token,
  //   sheet_id,
  //   "J24:J24",
  //   [[398]]
  // ).then((res) => {
  //   console.log(res);
  // });

  // await getRankInfo()
  // await bidding({category: "手机", brand:"小米", model: "小米 15"})
  // await levelPrice()
};

module.exports = app;
