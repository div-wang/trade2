/*
 * @Description: 入口文件
 * @Author: Div
 * @Date: 2019-08-19 10:14:15
 * @LastEditors: Div gh110827@gmail.com
 * @LastEditTime: 2025-11-27 15:59:36
 */

const http = require("http");
const Koa = require("koa");
const app = new Koa();
// 处理文件设置
const { koaBody } = require("koa-body");
app.use(
  koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true, // 保持文件的后缀
      hash: "md5",
      maxFileSize: 100 * 1024 * 1024, // 设置上传文件大小最大限制
    },
  })
);

global.Env = process.env.NODE_ENV || "local";
// 全局注册Logger
global.Logger = require("./utils/Logger");
// 全局注册配置文件
global.Configs = require("./config");
// 全局注册缓存文件
global.ChildOrderCache = {}
global.RankInfoCache = {}
// 生成随机数
global.randomNum = (minNum, maxNum) => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};
// 睡眠函数，毫秒
global.sleep = (time, options) => {
  return new Promise((resolve, reject) => {
    time = time || randomNum(100, 1000);
    if (options && options.logs) {
      Logger.info(`===暂停${parseInt(time / 1000)}秒===`);
    }
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const start = async () => {
  const cacheSheet = require("./handler/cacheSheet");
  // 处理middleware
  const header = require("./middleware/header");
  const onerror = require("./middleware/onerror");
  const routers = require("./router");
  app.use(onerror);
  app.use(header);
  app.use(routers);
  await cacheSheet()
  // 监听http和https
  const httpServer = http.createServer(app.callback());
  httpServer.listen(Configs.port, async () => {
    Logger.info(`listen: ${Configs.port}`);
    if (process.env.DEBUG_ENV) {
      const test = require("./test");
      test();
    }
  });
};
try {
  start();
} catch (error) {
  Logger.error(error);
}
