const {findSheetData, modifySheetData} = require("../../../handler/feishu");

const app = async (ctx) => {
  let req = { code: 0, msg: "ok" };
  try {
    let { list, user } = ctx.request.body;
    for (let i = 0; i < list.length; i++) {
      const imei = list[i];
      const { spreadsheet_token, sheet_id } = configs.grabInfo[user];
      const res = await findSheetData(imei, spreadsheet_token, sheet_id);
      // console.log(imei, res);
      const findArr = res.data.find_result.matched_cells;
      const findIndex = findArr[0] && findArr[0].slice(1);
      const range = "C" + findIndex + ":" + "C" + findIndex;
      const newData = ["退货成功"];
      if (findIndex) {
        logger.info("modifySheetData2", range, newData);
        await modifySheetData(spreadsheet_token, sheet_id, range, [newData]);
      }
    }
    req.data = list;
  } catch (error) {
    logger.error(error);
    req = { code: 1, msg: error };
  }
  return req;
};

module.exports = app;
