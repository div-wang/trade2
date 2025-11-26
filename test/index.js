const { findSheetData, modifySheetData } = require("../handler/feishu");
const paijitang = require("../handler/paijitang");
const zhuanzhuan = require("../handler/zhuanzhuan");

const app = async () => {
  // const {spreadsheet_token, sheet_id} = Configs.grabInfo.ya
  // await modifySheetData(
  //   spreadsheet_token,
  //   sheet_id,
  //   "J24:J24",
  //   [[398]]
  // ).then((res) => {
  //   console.log(res);
  // });


  // const clent = new paijitang(Configs.grabInfo.hui.paijitang)
  // const res = await clent.refund()
  // Logger.info(res.data)
  const zhuan = new zhuanzhuan(Configs.grabInfo.hui.zhuanzhuan);
  const data = await zhuan.getRankInfo({
        tabToken: "qy01da601ec723b205288e2587b0_1703041199959",
        relationId: "22",
        platformType: "zz",
        refContent: "sjtab",
        rankIds: "463",
        isFirst: true,
      })
  Logger.info(data.respData.subRankInfoList)
};

module.exports = app;
