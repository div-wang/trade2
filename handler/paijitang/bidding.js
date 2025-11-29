const { getBrowsers, openBrowserPage } = require("../bitBrowser");

const checkPageByTitle = async (context, pageTitle) => {
  let pages = await context.pages();
  let newPage;
  // 判断竞价页面是否已打开
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const title = await page.title();
    if (title === pageTitle) newPage = page;
  }
  return newPage;
};

const biddingListPage = async (context) => {
  let page = await checkPageByTitle(context, "拍机堂-竞价管理-竞价单列表");
  // 未打开竞价页面使用goto方法打开
  if (!page) {
    const newPage = await context.newPage();
    page = await newPage.goto(
      "https://www.paijitang.com/backend/bidding/list?active=bidding&typeid=10"
    );
  } else {
    await page.reload();
  }
  return page;
};

const biddingDetailPage = async (context, listPage) => {
  let page = await checkPageByTitle(context, "拍机堂-竞价管理-竞价单详情");
  if (!page) {
    const allLinks = await listPage.$$(
      ".ant-table-fixed-right .actions-wrapper > a"
    );
    if (allLinks.length) {
      await allLinks[allLinks.length - 1].click(); // 操作最后一个元素
      await sleep(1000);
      // 等待并获取新页面
      pages = await context.pages();
      page = pages[pages.length - 1];
      await page.waitForLoadState(); // 等待新页面加载完成
      Logger.info("新页面标题：", await page.title());
    } else {
      Logger.info("未找到匹配元素");
    }
  }
  return page;
};

const biddingSearch = async (page, data) => {
  await page.click('button:has-text("重 置")');
  let moduleInput = await page.waitForSelector(
    ".pjt-next-antd-input.css-r66u5c"
  );
  await moduleInput.click();
  await sleep();
  // 手机型号
  await page.click(`button:has-text("${data.category}")`);
  await sleep();
  await page.click(`button:has-text("${data.brand}")`);
  await sleep();
  await page.click(`span:text-is("${data.model}")`);
  await sleep();
  await page.click('button:has-text("确 认")');
  await sleep();
  // 成色
  await page.click('span:has-text("请选择等级")');
  await sleep();
  await page
    .locator(".pjt-next-antd-select-tree-switcher_open")
    .first()
    .click();
  await sleep();
  await page.click('span[aria-label="Select S-B"]');
  await sleep();
  await page.click('span[aria-label="Select C-E"]');
  await sleep();
  // 其他参数
  // await page.locator(".pjt-next-antd-select-selector").nth(3).click();
  // await sleep();
  // await page.click('.pjt-next-antd-select-item-option-content:text("国行")');
  // await sleep();
  // await page.click(
  //   '.pjt-next-antd-select-item-option-content:text("国行-其他")'
  // );
  // await sleep();
  // 查询
  await page.click('button:has-text("查 询")');
  await sleep();
  await page.locator(".pjt-next-antd-select-selector").nth(5).click();
  await sleep();
  await page.click('div[title="50 条/页"]');
  await nextPage(page);
};

const nextPage = async (page) => {
  await sleep(5000, 10000);
  const pages = await page.$$(".pjt-next-antd-pagination-item");
  const index = await page.getAttribute(
    ".pjt-next-antd-pagination-item-active",
    "title"
  );
  if (index < pages.length) {
    await pages[index].click();
    await nextPage(page);
  }
};

const interceptApi = async (page) => {
  // 拦截指定接口（支持精确URL、正则匹配）
  page.on("response", async (response) => {
    const url = response.url();
    const status = response.status(); // 响应状态码
    if (status === 200 && url.includes("recycler-api/game-rounds/goods/dark/running/goods")) {
      const responseBody = await response.json(); // 响应体（JSON格式）
      const goods = responseBody && responseBody.data;
      goods.forEach((e) => {
        console.log(e);
        const {
          mainTitle,
          viceTitle,
          levelName,
          startPrice,
          inspectionTypeName,
        } = e;
        const tArr = mainTitle.trim().split(" ");
        const vArr = viceTitle.split("|");
        const oArr = tArr[tArr.length - 1].split("+");
        const data = {
          color: tArr[tArr.length - 2],
          memory: oArr[0],
          storage: oArr[1],
          level: levelName,
          price: startPrice,
          inspection: inspectionTypeName,
          baoxiu: vArr[0],
          channel: vArr[2],
        };
        // console.log(data)
      });
    }
  });
};

const app = async (data) => {
  Logger.info("开始打开比特浏览器");
  const { browser, context } = await openBrowserPage(
    "f9cde976ed654d1a88527fb76decb639"
  );
  const listPage = await biddingListPage(context);
  const biddingPage = await biddingDetailPage(context, listPage);
  await interceptApi(biddingPage);
  await biddingSearch(biddingPage, data);

  // const detailLink = await page.waitForSelector('.ant-table-tbody .actions-wrapper > a');
  // await detailLink.click();
};

module.exports = app;
