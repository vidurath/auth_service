const config = require("../config/db.config.js");
const { logger } = require("../logging/logger");
const sequelize = require("sequelize");
const sequelizeObj = new sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: (msg) => logger.info(msg),
    port: process.env.DB_PORT,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
    define: {
      schema: process.env.DB_SCHEMA,
      hooks: {
        beforeUpdate() {
          // Do stuff
        },
      },
    },
  }
);
const db = {};
db.sequelize = sequelize;
db.sequelizeObj = sequelizeObj;
db.user = require("./user.model.js")(sequelizeObj, sequelize);

module.exports = db;
