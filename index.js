/*
 * @Description: 入口文件
 * @Author: Div
 * @Date: 2019-08-19 10:14:15
 * @LastEditors: Div gh110827@gmail.com
 * @LastEditTime: 2025-11-07 19:18:52
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

// 生成随机数
global.randomNum = (minNum, maxNum) => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};

global.env = process.env.NODE_ENV || "local";
// 全局注册logger
global.logger = require("./utils/logger");
// 全局注册配置文件
global.configs = require("./config");

const start = async () => {
  // 处理middleware
  const header = require("./middleware/header");
  const onerror = require("./middleware/onerror");
  const routers = require("./router");
  app.use(onerror);
  app.use(header);
  app.use(routers);
  // 监听http和https
  const httpServer = http.createServer(app.callback());
  httpServer.listen(configs.port, async () => {
    logger.info(`listen: ${configs.port}`);
    if (process.env.DEBUG_ENV) {
      const test = require("./test");
      test();
    }
  });
};
try {
  start();
} catch (error) {
  logger.error(error);
}
