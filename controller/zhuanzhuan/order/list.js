const zhuanzhuan = require("../../../handler/zhuanzhuan");

const app = async (ctx) => {
  let req = { code: 0, msg: "ok" };
  try {
    let { user } = ctx.request.body;
    const config = Configs.grabInfo[user].zhuanzhuan;
    const zhuan = new zhuanzhuan(config);
    const list = await zhuan.getOrderIds();
    req.data = list;
  } catch (error) {
    Logger.error(error);
    req = { code: 1, msg: error };
  }
  return req;
};

module.exports = app;
