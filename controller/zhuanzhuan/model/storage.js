const getModelStorage = require("../../../handler/zhuanzhuan/model/storage");
const app = async (ctx) => {
  let req = { code: 0, msg: "ok" };
  try {
    req.data = await getModelStorage()
  } catch (error) {
    Logger.error(error);
    req = { code: 1, msg: error };
  }
  return req;
};

module.exports = app;
