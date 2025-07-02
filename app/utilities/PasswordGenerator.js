const db = require("../models");
var bcrypt = require("bcryptjs");
const axios = require("axios");
const Op = db.sequelize.Op;
const password = db.password;
const sequelize = db.sequelize;
const { logger } = require("../logging/logger");
generatePassword = () => {
  var password = "";
  password +=
    getRandomLower().toUpperCase() +
    getRandomLower() +
    getRandomLower() +
    getRandomNumber() +
    getRandomLower() +
    getRandomLower().toUpperCase() +
    getRandomLower() +
    getRandomSymbol();
  return password.shuffle();
};
function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}
function getRandomSymbol() {
  const symbols = "!@#$%0&*";
  return symbols[Math.floor(Math.random() * symbols.length)];
}
String.prototype.shuffle = function () {
  var a = this.split(""),
    n = a.length;

  for (var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
};
checkPasswordExpiry = (password, creationDate, validityPeriod) => {
  var createdOn = new Date(creationDate);
  var now = new Date();
  createdOn.setDate(createdOn.getDate());
  // check now and compare between valid till
  var difference = (now - createdOn) / (1000 * 60 * 60 * 24);
  if (
    validityPeriod - Math.floor(difference) == 3 ||
    validityPeriod - Math.floor(difference) == 2 ||
    validityPeriod - Math.floor(difference) == 1
  ) {
    return validityPeriod - Math.floor(difference);
  } else if (Math.floor(difference) < validityPeriod) {
    return 0;
  } else {
    return -1;
  }
};
checkForOldPasswords = async (newPassword, userId) => {
  var result = await getConfig("LAF").then((sysconfig) => {
    return password
      .findAll({
        where: {
          userId: userId,
        },
        order: [["dateCreated", "DESC"]],
        limit: sysconfig?.SOURCE_VALUE ? sysconfig?.SOURCE_VALUE : 1,
        attributes: [
          "password",
          "userId",
          "id",
          "status",
          [
            sequelize.cast(sequelize.col("dateCreated"), "varchar"),
            "dateCreated",
          ],
        ],
      })
      .then((passwordObj) => {
        if (!passwordObj) {
          // return false;
        }
        for (i = 0; i < passwordObj.length; i++) {
          if (bcrypt.compareSync(newPassword, passwordObj[i].password)) {
            return true;
          }
        }
        return false;
      });
  });
  return result;
};
checkPasswordComplexity = (username, passwords) => {
  username = username.toLowerCase();
  if (passwords) {
    var passwordLower = passwords.toLowerCase();
    var hasUpperCase = /[A-Z]/.test(passwords);
    var hasLowerCase = /[a-z]/.test(passwords);
    var hasNumbers = /\d/.test(passwords);
    var hasNonalphas = /\W/.test(passwords);
    if (passwords.length < 8) {
      return `Error! password should be at least 8 characters and comprise of at least one special character, one uppercase letter and one number`;
    } else if (passwordLower.includes(username)) {
      return `Error! password should not contain username`;
    } else if (!hasUpperCase) {
      return `Error! password does not contain uppercase`;
    } else if (!hasLowerCase) {
      return `Error! password does not contain lowercase`;
    } else if (!hasNumbers) {
      return `Error! password does not contain number`;
    } else if (!hasNonalphas) {
      return `Error! password does not contain any special character`;
    } else {
      return 1;
    }
  } else {
    return `Error! please input password`;
  }
};
// to check issue with token
async function getConfig(type) {
  let value = await axios
    .get(process.env.SYSCONFIG_API + "/getconfig", {
      params: {
        code: type,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      logger.error(error.message);
      return 0;
    });
  return value;
}
const PasswordGenerator = {
  generatePassword: generatePassword,
  checkPasswordExpiry: checkPasswordExpiry,
  checkForOldPasswords: checkForOldPasswords,
  checkPasswordComplexity: checkPasswordComplexity,
};
module.exports = PasswordGenerator;
