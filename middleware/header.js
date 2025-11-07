/*
 * @Description: 处理请求参数
 * @Author: Div
 * @Date: 2022-05-15 20:25:51
 * @LastEditors: Div gh110827@gmail.com
 * @LastEditTime: 2025-11-07 18:51:11
 */

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, OPTIONS",
};

// const jwtVerify = require("../handler/RPC/jwt");

module.exports = async (ctx, next) => {
  // 设置跨域请求头
  ctx.set(headers);
  // options 请求直接返回，不做处理
  if (ctx.method === "OPTIONS") {
    ctx.body = "";
    return;
  }
  let { ip, ips, body } = ctx.request;
  // 打印日志
  logger.info(
    `${ctx.url}:${
      ctx.method === "POST" ? JSON.stringify(body) : ""
    }, user IP: ${ip.replace("::ffff:", "")}, ${JSON.stringify(ips)}`
  );

  await next();
};
