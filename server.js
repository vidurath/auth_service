const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./app/models");
const express = require("express");
const env = process.env;
const sequelize = require("sequelize");
const initialData = require(`./app/scripts/initialData`);
const app = express();
const schema = process.env.DB_SCHEMA;
const { logger } = require("./app/logging/logger");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create table
const startServer = async () => {
  try {
    await db.sequelizeObj.query('CREATE SCHEMA IF NOT EXISTS "' + schema + '"');
    await db.sequelizeObj.sync();
    await initialData.loadData();
  } catch (error) {
    logger.error("Error during server startup:", error);
  }
};

startServer();


// test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Vid Blog." });
});

// routes
require('./app/routes/auth.routes')(app);

// set port, listen for requests
const PORT = env.SERVER_PORT || 4444;
app.listen(PORT, () => {
  logger.info(`Server started on port : ${PORT}`);
});

app.use((err, req, res, next) => {
  res.status(500).send('An Error occured. Please try again.')
})