const zhuanzhuan = require("../../../handler/zhuanzhuan");

const app = async (ctx) => {
  let req = { code: 0, msg: "ok" };
  try {
    let { qcCode, user } = ctx.request.body;
    const config = configs.grabInfo[user];
    const zhuan = new zhuanzhuan(config);
    const getIMEIResult = await zhuan.getIMEI(qcCode);
    // logger.info(getIMEIResult);
    req.data = getIMEIResult;
  } catch (error) {
    logger.error(error);
    req = { code: 1, msg: error };
  }
  return req;
};

module.exports = app;
