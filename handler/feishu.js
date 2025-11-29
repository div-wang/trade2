/*
 * @Author: Div gh110827@gmail.com
 * @Date: 2025-11-12 20:47:44
 * @LastEditors: Div gh110827@gmail.com
 * @LastEditTime: 2025-11-28 19:38:46
 * @Description: 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
const lark = require("@larksuiteoapi/node-sdk");
const client = new lark.Client(Configs.lark);

const getSpreadsheetSheets = async (spreadsheet_token) => {
  return client.sheets.v3.spreadsheetSheet.query({
    path: {
      spreadsheet_token,
    },
  });
};

const getSheetData = async (spreadsheet_token, sheet_id, range) => {
  return client.request({
    method: "GET",
    url:
      `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${spreadsheet_token}/values/${sheet_id}` +
      (range || ""),
    params: {
      valueRenderOption: "ToString",
      dateTimeRenderOption: "FormattedString",
    },
  });
};

const findSheetData = async (queryString, spreadsheet_token, sheet_id) => {
  return client.sheets.v3.spreadsheetSheet.find({
    path: {
      spreadsheet_token,
      sheet_id,
    },
    data: {
      find_condition: {
        range: sheet_id,
        match_case: true,
        match_entire_cell: false,
        search_by_regex: false,
        include_formulas: false,
      },
      find: queryString,
    },
  });
};

const modifySheetData = async (
  spreadsheet_token,
  sheet_id,
  range,
  row_data
) => {
  return client.request({
    method: "PUT",
    url: `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${spreadsheet_token}/values`,
    data: {
      valueRange: {
        range: sheet_id + "!" + range,
        values: row_data,
      },
    },
    params: {},
  });
};

const insertSheetData = async (
  spreadsheet_token,
  sheetId,
  startIndex,
  endIndex
) => {
  return client.request({
    method: "POST",
    url: `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${spreadsheet_token}/insert_dimension_range`,
    data: {
      dimension: {
        sheetId: sheetId,
        majorDimension: "ROWS",
        startIndex: startIndex || 1,
        endIndex: endIndex ? endIndex : startIndex + 1,
      },
      inheritStyle: "",
    },
    params: {},
  });
};

module.exports = {
  getSpreadsheetSheets,
  getSheetData,
  findSheetData,
  modifySheetData,
  insertSheetData,
};
