const biddingList = require("../../../handler/paijitang/bidding");
const app = async (ctx) => {
  let req = { code: 0, msg: "ok" };
  try {
    const { index } = ctx.request.body;
    let list = ModelInfoListCache;
    // 对比拍机堂价格
    for (let i = (index || 0); i < list.length; i++) {
      const { modelId, name } = list[i];
      const model = name.trim();
      const nameArr = model.split(" ");
      const brand = nameArr[0];
      console.log(brand, model);
      await biddingList({ category: "手机", brand, model, modelId });
    }
  } catch (error) {
    Logger.error(error);
    req = { code: 1, msg: error };
  }
  return req;
};

module.exports = app;
