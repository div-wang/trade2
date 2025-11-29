const zhuanzhuan = require("../../../handler/zhuanzhuan");

const app = async (ctx) => {
  let req = { code: 0, msg: "ok" };
  try {
    let { user } = ctx.request.body;
    const config = Configs.zhuanzhuan[user];
    const zhuan = new zhuanzhuan(config);
    const list = await zhuan.getOrderIds();
    Logger.info("orderIds", list);
    for (let i = 0; i < list.length; i++) {
      if (i > 15) continue;
      const orderId = list[i];
      await zhuan.getChildOrderIds(orderId);
    }
  } catch (error) {
    Logger.error(error);
    req = { code: 1, msg: error };
  }
  return req;
};

module.exports = app;
