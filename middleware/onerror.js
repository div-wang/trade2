module.exports = async (ctx, next) => {
  try {
    await next();
    const status = ctx.status
    if (status >= 400) {
      ctx.response.status = ctx.status;
      const errArr = {
        404: "未找到接口，请检查请求地址是否正确",
        403: "您没有权限访问该接口",
        401: "token失效了",
      };
      ctx.body = errArr[ctx.status] ? errArr[ctx.status] : ctx.body;
    }
  } catch (err) {
    const errData = err instanceof Error ? err.stack : err;
    logger.error("Catch Error: " + errData);
    ctx.body = { code: 0, status: 500, msg: errData };
  }
};
