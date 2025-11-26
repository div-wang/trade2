const getRankInfo = require("../../handler/zhuanzhuan/rank");
const app = async (ctx) => {
  let req = { code: 0, msg: "ok" };
  try {
    await getRankInfo()
  } catch (error) {
    Logger.error(error);
    req = { code: 1, msg: error };
  }
  return req;
};

module.exports = app;
