const { findSheetData, modifySheetData, insertSheetData } = require("../handler/feishu");
const paijitang = require("../handler/paijitang");
const getRankInfo = require("../handler/zhuanzhuan/rank");

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


  // const clent = new paijitang(Configs.paijitang.div)
  // const res = await clent.refund()
  // Logger.info(res.data)


  // await getRankInfo()
};

module.exports = app;
