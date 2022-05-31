const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

/**
 * Verify JWT Function
 */
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  // If not Token provided => Return Error
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  // Verify JWT with Secret
  jwt.verify(token, config.secret, (err, decoded) => {
    // If we get an error => return error
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

/**
 * Check if admin Function
 */
isAdmin = (req, res, next) => {
  // Find user by ID
  User.findById(req.userId).exec((err, user) => {
    // If we get an error => return error
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // Find Roles in found User
    Role.find({
      _id: { $in: user.roles },
    }),
      (err, roles) => {
        // If we get an error => return error
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        // If one of the user's roles is "admin" => Next
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        // If user has no "admin" Role => Return 403 Status => No Access
        res.status(403).send({ message: "Require Admin Role" });
        return;
      };
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
};

module.exports = authJwt;
