const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

/**
 * Create Routes for Sign Up and Sign In
 */
module.exports = function (app) {
  app.use(function (req, res, next) {
    //Set Headers
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  /**
   * Sign Up Route => Check for Duplicated Username or Email => Check if Roles Existed => Sign Up
   */
  app.post("/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], controller.signup);

  /**
   *  Sign In Route
   */
  app.post("/api/auth/signin", controller.signin);
};
