/*
 * @Description: 注册日志
 * @Author: Div
 * @Date: 2019-08-20 15:45:57
 * @LastEditors: Div gh110827@gmail.com
 * @LastEditTime: 2025-11-07 19:35:22
 */
const logger = require("tracer").dailyfile({
  root: global.env === 'local' ? "./logs" : "/export/logs",
  format: "{{timestamp}} <{{title}}> ({{file}}:{{line}}) {{message}}",
  dateformat: "yyyy-mm-dd HH:MM:ss.L",
  allLogsFileName: `trade2-${env}`,
  transport: function (data) {
    if (env === 'local') console.log(data.output);
  },
  inspectOpt: {
    showHidden: true, //the object's non-enumerable properties will be shown too
    depth: 2, //tells inspect how many times to recurse while formatting the object. This is useful for inspecting large complicated objects. Defaults to 2. To make it recurse indefinitely pass null.
  },
});

module.exports = logger;
