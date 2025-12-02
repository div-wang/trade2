const getModelPrice = require("../../../handler/zhuanzhuan/model/price");
const app = async (ctx) => {
  let req = { code: 0, msg: "ok" };
  try {
    const { models } = ctx.request.body;
    let list = ModelInfoListCache;
    // list = Array.isArray(models) && models;
    await getModelPrice(list);
  } catch (error) {
    Logger.error(error);
    req = { code: 1, msg: error };
  }
  return req;
};

module.exports = app;
