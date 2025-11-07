/*
 * @Description: 正则验证
 * @Author: Div
 * @Date: 2019-08-19 11:32:21
 * @LastEditors: Div
 * @LastEditTime: 2023-06-16 21:32:20
 */

// 验证双字节字符串
const RegDoubleByte = /[^\x00-\xff]/g;
// 验证密码
const RegPassword = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^_+$)^\w{6,20}$/;
// 验证手机号
const RegPhone =
  /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
// 验证邮箱
const RegEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
// 验证金额是否是正数，是否是两位小数
const RegAmount = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
// 验证空格
const RegSpace = /(\s+)/g;
// 验证验证码
const RegCode = /^[0-9]{6}?$/;
// 验证url
const RegUrl = /^(http[s]?:\/\/)([\S]*)$/;
// 验证银行卡
const RegBankNo = /^([1-9]{1})(\d{15}|\d{16}|\d{17}|\d{18})$/;
// 验证车牌
const RegVehicleNumber =
  /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}([A-Z0-9]{4}|[A-Z0-9]{5})[A-Z0-9挂学警港澳]{1}$/;
// 验证身份证号
const RegIdCardNumber =
  /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
// 验证车架号
const RegVehicleFrameNo = /^[ABCDEFGHJKLMNPRSTUVXWYZ0-9]{17}?$/;
// 字母数字
const RegAlphanumeric = /[A-Za-z0-9]/;
// 验证是否为空对象
const isEmptyObject = (o) => {
  for (let t in o) {
    return false;
  }
  return true;
};

module.exports = {
  RegAlphanumeric,
  RegVehicleNumber,
  RegDoubleByte,
  RegPassword,
  RegBankNo,
  RegSpace,
  RegEmail,
  RegPhone,
  RegCode,
  RegUrl,
  RegAmount,
  isEmptyObject,
  RegVehicleFrameNo,
  RegIdCardNumber,
};
