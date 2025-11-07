/*
 * @Description: 获取文件MD5
 * @Author: Div
 * @Date: 2019-08-20 15:45:57
 * @LastEditors: Div
 * @LastEditTime: 2021-08-12 11:10:33
 */

const getFileMD5 = (filePath) => {
  const fs = require('fs');
  const crypto = require('crypto');
  const hash = crypto.createHash('md5');
  const buffer = fs.readFileSync(filePath);
  hash.update(buffer);
  return hash.digest('hex');
}

const getMD5 = (str) => {
  const fs = require('fs');
  const crypto = require('crypto');
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

module.exports = { getFileMD5, getMD5 }