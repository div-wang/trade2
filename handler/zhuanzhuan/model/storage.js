/*
 * @Author: Div gh110827@gmail.com
 * @Date: 2025-11-28 18:56:47
 * @LastEditors: Div gh110827@gmail.com
 * @LastEditTime: 2025-12-01 22:19:37
 * @Description: 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
const { modifySheetData, insertSheetData } = require("../../feishu");
const { openBrowserPage } = require("../../bitBrowser");

const detailPage = async (url) => {
  // Logger.info("开始打开比特浏览器");
  const { browser, context } = await openBrowserPage(
    Configs.browserId
  );
  const page = await context.newPage();
  // Logger.info("打开转转型号页面");
  await page.goto(url);
  // 开始搜索
  await page.waitForSelector(
    ".z-biz-filter-tab__horizontal__list__item__wrapper__text"
  );
  await Sleep();
  // 点击容量筛选
  await page.click(
    '.z-biz-quick-filter__horizontal__list__item__select:has-text("容量")'
  );
  await Sleep();
  const storageItems = await page.$$(
    ".z-quick-check-panel__wrapper__item"
  );
  await Sleep();
  let storageList = []
  for (let j = 0; j < storageItems.length; j++) {
    const sItem = storageItems[j];
    storageCache = await sItem.innerText();
    storageList.push(storageCache)
  }
  await page.close();
  await Sleep();
  return storageList;
};

const app = async () => {
  const newList = ModelInfoListCache;
  // 抓取型号
  const newData = {}
  for (let index = 0; index < newList.length; index++) {
    const {modelId, url, brandId} = newList[index];
    const storageList = await detailPage(url);
    Logger.info(`"${modelId}":${JSON.stringify(storageList)},`)
    newData[modelId] = storageList
  }
  return newData
};

module.exports = app;
