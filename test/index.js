const { findSheetData, modifySheetData, insertSheetData } = require("../handler/feishu");
const getRankInfo = require("../handler/zhuanzhuan/rank");
const {getBrowsers, openBrowserPage} = require("../handler/bitBrowser");

const app = async () => {
  // const {spreadsheet_token, sheet_id} = Configs.lark.ya
  // await modifySheetData(
  //   spreadsheet_token,
  //   sheet_id,
  //   "J24:J24",
  //   [[398]]
  // ).then((res) => {
  //   console.log(res);
  // });


  // await getRankInfo()
  Logger.info('开始打开比特浏览器')
  const page = await openBrowserPage('f9cde976ed654d1a88527fb76decb639');
  await page.goto('https://www.paijitang.com/backend/bidding/list?active=bidding&typeid=10');
  await sleep(3000);
  // const detailBtn = await page.locator('.actions-wrapper').first()
  await page.getByRole('button', { name: '详情' }).click();
  await detailBtn.click();
};

module.exports = app;
