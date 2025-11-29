const {
  getBrowserList,
  closeBrowser,
  openBrowser,
} = require("../utils/bitBrowser");
const { chromium } = require("playwright");
const getBrowsers = async () => {
  const res = await getBrowserList();
  const list = res.data.list;
  const data = {};
  for (let i = 0; i < list.length; i++) {
    const { id, name, platform, seq } = list[i];
    data[id] = {
      id,
      name: seq + "-" + name,
      openTime: 0,
      platform
    };
  }
  Logger.info(data);
  return data;
};

const checkBrowserOpenTime = async (id) => {
  const browserInfo = Configs.browserList[id];
  const time = Date.now();
  if (browserInfo && browserInfo.openTime && id != Configs.grabBrowserId) {
    if (time - browserInfo.openTime > 480000) {
      await closeBrowser(id);
    }
  } else {
    Configs.browserList[id].openTime = time;
  }
  return await openBrowser({ id });
};

const openBrowserPage = async(browserId) => {
  // 打开比特浏览器
  const bitBrowser = await checkBrowserOpenTime(browserId);
  if (!bitBrowser.success) return false;
  // 使用playwright链接浏览器
  const browser = await chromium.connectOverCDP(bitBrowser.data.ws);
  const context = browser.contexts()[0];
  return {browser, context}
}

module.exports = { getBrowsers, checkBrowserOpenTime, openBrowserPage };
