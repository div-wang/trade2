/*
 * @Description: 数据库连接工具
 * @Author: Div
 * @Date: 2019-08-19 10:24:58
 * @LastEditors: Div
 * @LastEditTime: 2021-08-16 10:53:18
 */
const Sequelize = require("sequelize");

const app = (conf) => {
  let { table, user, pass, host, port } = conf;
  return new Sequelize(table, user, pass, {
    host,
    port: port || 3306,
    dialect: "mysql",
    pool: {
      max: 100,
      min: 1,
      acquire: 30000,
      idle: 10000,
    },
    logging: (msg) => Logger.debug(msg),
  });
};

module.exports = app;
