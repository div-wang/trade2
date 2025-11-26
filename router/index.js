/*
 * @Description:
 * @Author: 高彩鹏
 * @Date: 2021-08-27 19:02:07
 * @LastEditors: Div gh110827@gmail.com
 * @LastEditTime: 2025-11-07 19:39:52
 */
const fs = require("fs");
const path = require("path");

const files = [];
const readdir = (filePath) => {
  const filePaths = fs.readdirSync(path.join(__dirname, filePath));
  for (let i = 0; i < filePaths.length; i++) {
    const fileName = filePaths[i];
    if ([".DS_Store"].includes(fileName)) {
      continue;
    }
    const pathDir = filePath + "/" + fileName;
    const pathRoot = path.join(__dirname, filePath + "/" + fileName);
    if (fs.statSync(pathRoot).isFile()) {
      files.push(pathDir);
    } else {
      readdir(pathDir);
    }
  }
};
readdir("../controller");

const methodHandle = async ({ method, ctx, next, uri, end }) => {
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    if (fileName.includes(".js")) {
      const file = require(fileName);
      if (typeof file.method === "object") {
        for (let i = 0; i < file.method.length; i++) {
          let item = file.method[i];
          item = item.toUpperCase();
        }
      }
      // 判断是否指定method方法
      const fileNameFunction = file.method ? file.app : file;
      // 判断请求方法，默认POST，支持"get" || ["get", "POST"]
      let isMethod =
        typeof file.method === "string"
          ? file.method.toUpperCase() === method
          : typeof file.method === "object"
          ? file.method.includes(method)
          : method === "POST";
      const path = fileName
        .replace("../controller/", "/")
        .replace(".js", "")
        .replace("/index", "");
      // const isPath = (router) => {
      //   return uri === router && path === router && isMethod;
      // };
      if (uri === path && isMethod) {
        // 关闭计时器并添加标签
        // end({ route: uri, code: ctx.statusCode, method: ctx.method });
        ctx.body = await fileNameFunction(ctx, next);
      }
    }
  }
};

const app = async (ctx, next) => {
  try {
    const uri = ctx.path;
    const method = ctx.method;
    if (method === "GET") {
      await methodHandle({ method, uri, ctx, next });
    } else if (method === "POST") {
      await methodHandle({ method, uri, ctx, next });
    }
  } catch (err) {
    const errData = err instanceof Error ? err.stack : err;
    Logger.error("Router Error: ", errData);
    ctx.body = errData;
  }
};
module.exports = app;
