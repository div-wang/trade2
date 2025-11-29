const { getBrowsers, openBrowserPage } = require("../bitBrowser");

const quality = {
  "https://pic3.zhuanstatic.com/zhuanzh/9df43ea0-84bc-4727-b070-53f9ce280a57.png":
    "99S",
  "https://pic3.zhuanstatic.com/zhuanzh/c4a46a75-3314-417e-bdbd-4d2d3ad76194.png":
    "99A",
  "https://pic3.zhuanstatic.com/zhuanzh/01cfa892-5353-4920-9847-238e08de408a.png":
    "95C",
  "https://pic3.zhuanstatic.com/zhuanzh/87788885-6917-4bdf-ae09-9deac8fc5d8f.png":
    "95B",
  "https://pic3.zhuanstatic.com/zhuanzh/3c2b49e0-3704-47af-8f84-28f83498c68f.png":
    "95A",
  "https://pic3.zhuanstatic.com/zhuanzh/916a647b-d55b-4a9a-8a11-0fe4f96b889a.png":
    "9C",
  "https://pic3.zhuanstatic.com/zhuanzh/87788885-6917-4bdf-ae09-9deac8fc5d8f.png":
    "9B",
  "https://pic3.zhuanstatic.com/zhuanzh/d3c44952-6f81-40a3-a276-57c34d54b35c.png":
    "9A",
  "https://pic3.zhuanstatic.com/zhuanzh/48495a2b-ebe0-4b4b-8fe6-a249e97627b9.png":
    "8C",
  "https://pic3.zhuanstatic.com/zhuanzh/0b84ff84-d659-4c9b-9e3f-28e8f552497a.png":
    "8B",
  "https://pic3.zhuanstatic.com/zhuanzh/df3a29c9-6e0f-4697-aa35-a4143452e9ad.png":
    "8A",
};

const detailPage = async (url) => {
  Logger.info("开始打开比特浏览器");
  const { browser, context } = await openBrowserPage(
    "f9cde976ed654d1a88527fb76decb639"
  );
  const newPage = await context.newPage();
  Logger.info("打开转转型号页面");
  await newPage.goto(url);
  return newPage;
};

const detailSearch = async (page, data) => {
  // 开始搜索
  await page.waitForSelector(
    ".z-biz-filter-tab__horizontal__list__item__wrapper__text"
  );
  await page.click(
    '.z-biz-filter-tab__horizontal__list__item__wrapper__text:has-text("价格")'
  );
  await sleep();

  // 监听数据
  await interceptApi(page);
  // 筛选参数
  const levels = ["8成新", "9成新", "95新"];
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    // 缓存选中等级
    levelCache = level
    // 点击等级筛选
    await page.click(
      '.z-biz-quick-filter__horizontal__list__item__select:has-text("等级")'
    );
    // 取消上一个等级
    const prevLevel = levels[i - 1];
    prevLevel && (await page.click(`li[zz-sortname="${prevLevel}"]`));
    await sleep();
    // 选择对应等级
    await page.click(`li[zz-sortname="${level}"]`);
    await sleep();
    await page.click('.z-quick-check-panel__confirm:has-text("确定")');
    await sleep(2000, 5000);

    // 点击容量筛选
    await storageSelect(page)
    // 确定按钮组
    const confirmBtns = await page.$$(
      '.z-quick-check-panel__confirm:has-text("确定")'
    );
    // 循环点击容量数据
    const wrappers = await page.$$(".z-quick-check-panel__wrapper");
    const storageEl = wrappers[1];
    const storageItems = await storageEl.$$(
      ".z-quick-check-panel__wrapper__item"
    );
    for (let j = 0; j < storageItems.length; j++) {
      if (i > 0 && i%2 === 1 && j === storageItems.length - 1) continue;
      if (i > 0 && i%2 === 0 && j === storageItems.length - 2) continue;
      // 容量参数每次需要点击弹出选择框，
      if (j > 0) {
        await storageSelect(page)
      }
      // 点击容量
      const sItem = storageItems[j];
      // 缓存选中容量
      storageCache = await sItem.innerText()
      await sItem.click();
      await sleep();
      // 点击确定按钮
      await confirmBtns[1].click();
      await sleep(3000, 5000);
    }
  }
};

const storageSelect = async (page, each)=> {
  await page.click(
    '.z-biz-quick-filter__horizontal__list__item__select:has-text("容量")'
  );
  await sleep();
  const resetBtns = await page.$$(
    '.z-button__text-main:has-text("重置")'
  );
  await resetBtns[1].click()
}

const interceptApi = async (page) => {
  // 拦截指定接口（支持精确URL、正则匹配）
  page.on("response", async (response) => {
    const url = response.url();
    const status = response.status(); // 响应状态码
    if (status === 200 && url.includes("zzopen/ypmall/listData")) {
      const responseBody = await response.json(); // 响应体（JSON格式）
      const resData = responseBody && responseBody.respData;
      const goods = resData && resData.datas;
      goods.forEach((e) => {
        const { realPayPrice, titlePrefixLabel } = e;
        const Q = quality[titlePrefixLabel];
        // const word = Q && Q.includes(levelCache) ? Q.replace(levelCache, '') : ''
        if (!Q || !storageCache || Q.includes('C')) return;
        const key = `${Q}-${storageCache}`
        let price = levelPriceData[key]
        if (price && price < realPayPrice) return
        levelPriceData[key] = realPayPrice
      });
      // console.log(levelPriceData);
    }
  });
};
let levelPriceData = {},
  levelCache,
  storageCache;
const app = async (url) => {
  levelPriceData = {};
  levelCache = "";
  storageCache = "";
  const page = await detailPage(url);
  await detailSearch(page);
  await page.close()
  return levelPriceData
};

module.exports = app;
