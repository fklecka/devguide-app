const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

/**
 * Create Routes for Authorization
 */

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  /**
   * Public Access Route
   */
  app.get("/api/test/all", controller.allAccess);

  /**
   *  User Access Route
   */
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  /**
   *  Admin Access Route
   */
  app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
};
