const { verifySignUp } = require("../middleware");
const authController = require("../controllers/auth.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/createuser",
    [
      verifySignUp.checkEmail,
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    authController.createuser
  );
  app.post("/login", authController.login);
};
