/*
 * @Description: 循环创建文件夹
 * @param [FilePath] filePath
 * @Author: Div
 * @Date: 2019-08-20 15:45:57
 * @LastEditors: Div
 * @LastEditTime: 2022-12-08 20:56:53
 */
const fs = require('fs');
const app = (filePath) => {
  // 先判断路径是否不存在
  if (!fs.existsSync(filePath)) {
    // 如果不存在，循环创建路径
    let arr = filePath.split('/');
    let path = '';
    for (let i = 0; i < arr.length - 1; i++) {
      path += arr[i] + '/';
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
    }
  }
};

module.exports = app;