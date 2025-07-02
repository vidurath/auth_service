const db = require("../models");
const location = db.location;
const role = db.role;
const user = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // check if Username exists
  user.findOne({
    where: {
      username: String(req.body.username)
    }
  }).then(userObj => {
    if (userObj) {
      res.status(400).send({
        message: "Error! Username is already in use!"
      });
      return;
    }

    // check if Email exists
    user.findOne({
      where: {
        email: String(req.body.email)
      }
    }).then(userObj => {
      if (userObj) {
        res.status(400).send({
          message: "Error! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

checkPasswordComplexity = (req, res, next) => {
  if (req.body.password) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password
    var passwordLower = req.body.password.toLowerCase();
    var hasUpperCase = /[A-Z]/.test(password);
    var hasLowerCase = /[a-z]/.test(password);
    var hasNumbers = /\d/.test(password);
    var hasNonalphas = /\W/.test(password);
    if (password.length < 8) {
      res.status(400).send({
        message: `Error! password should be at least 8 characters and comprise of at least one special character, one uppercase letter and one number`
      });
      return;
    } else if (passwordLower.includes(username)) {
      res.status(400).send({
        message: `Error! password should not contain username`
      });
      return;
    } else if (!hasUpperCase) {
      res.status(400).send({
        message: `Error! password does not contain uppercase`
      });
      return;
    } else if (!hasLowerCase) {
      res.status(400).send({
        message: `Error! password does not contain lowercase`
      });
      return;
    } else if (!hasNumbers) {
      res.status(400).send({
        message: `Error! password does not contain number`
      });
      return;
    } else if (!hasNonalphas) {
      res.status(400).send({
        message: `Error! password does not contain any special character`
      });
      return;
    } else {
      next();
    }
  } else {
    res.status(400).send({
      message: `Error! please input password`
    });
    return;
  }
}

checkEmail = (req, res, next) => {
  if (req.body.email) {
    if (!validateEmail(req.body.email)) {
      res.status(400).send({
        message: `Error! invalid email address`
      });
      return;
    }
    next();
  } else {
    res.status(400).send({
      message: `Error! invalid email address`
    });
    return;
  }
}
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const verifySignUp = {
  checkEmail: checkEmail,
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkPasswordComplexity: checkPasswordComplexity,
};

module.exports = verifySignUp;
