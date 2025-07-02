
var bcrypt = require("bcryptjs");
const { user } = require("../models");
const { logger } = require("../logging/logger");
loadData = async () => {
  try {
    const count = await user.count();
    if (count === 0) {
      logger.info("No users found, creating default admin user.");
      await user.create({
        username: process.env.DEFAULT_ADMIN_USERNAME,
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 8),
        firstName: "admin",
        lastName: "admin",
      });
      logger.info("Default admin user created successfully.");
    } else {
      logger.info(`${count} user(s) found, skipping admin creation.`);
    }
  } catch (error) {
    logger.error("Error loading initial data:", error);
  }
};
const initialData = {
  loadData: loadData,
};
module.exports = initialData;
