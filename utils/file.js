/*
 * @Description: 循环创建文件夹
 * @param [FilePath] filePath
 * @Author: Div
 * @Date: 2019-08-20 15:45:57
 * @LastEditors: Div gh110827@gmail.com
 * @LastEditTime: 2025-11-02 21:39:26
 */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const readFile = (fileName, bool) => {
  try {
    const filePath = path.resolve(__dirname, "../" + fileName);
    const jsonStr = fs.readFileSync(filePath, "utf-8");
    return bool ? excelStr : JSON.parse(jsonStr);
  } catch (error) {
    console.log("读取文件失败", error);
    return false;
  }
};

const createFile = (filePath, data, bool) => {
  let str = typeof data === "string" ? data : JSON.stringify(data);
  if (bool) {
    fs.appendFileSync(path.resolve(__dirname, "../" + filePath), str);
  } else {
    fs.writeFileSync(path.resolve(__dirname, "../" + filePath), str);
  }
};

const json2Excel = (jsonData, sheetName, header) => {
  if (!header) {
    header = [];
    for (const key in jsonData[0]) {
      header.push(key);
    }
  }
  // 创建工作簿和工作表
  const workbook = XLSX.utils.book_new();
  // 将 JSON 转换为工作表（自动生成表头）
  const worksheet = XLSX.utils.json_to_sheet(jsonData, { header });
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || "Sheet1");

  let filePath = `./zhuan/${sheetName}.xlsx`;
  try {
    XLSX.writeFile(workbook, filePath);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createFile, readFile, json2Excel };
