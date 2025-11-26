const zhuanzhuan = require("../../../handler/zhuanzhuan");

const app = async (ctx) => {
  let req = { code: 0, msg: "ok" };
  try {
    let { orderId, user } = ctx.request.body;
    const config = Configs.zhuanzhuan[user];
    const zhuan = new zhuanzhuan(config);
    const childOrderInfo = await zhuan.getChildOrderInfo(orderId)
    req.data = childOrderInfo;
  } catch (error) {
    Logger.error(error);
    req = { code: 1, msg: error };
  }
	return req
};

module.exports = app;
