/*
 * @Description: 统一处理Promise错误
 * @Author: Div
 * @Date: 2019-08-19 10:24:58
 * @LastEditors: Div
 * @LastEditTime: 2023-12-20 19:21:46
 */
const app = (callback) => {
  return new Promise((resolve, reject) => {
    try {
      callback(resolve, reject);
    } catch (err) {
      // console.log(err)
      logger.error(err);
    }
  });
};

module.exports = app;
