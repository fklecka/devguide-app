const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

/**
 * Check if Username or Email is already registered
 */
checkDuplicateUsernameOrEmail = (req, res, next) => {
  /**
   * USERNAME
   */
  // Attempt to find User
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    // If we get an errror => return error
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // If we find a User => Return Status 400 => Fail
    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
    // Attempt to find Email
    User.findOne({
      email: req.body.email,
    }).exec((err, email) => {
      // If we get an error => return error
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // If we find an email => Return Status 400 => Fail
      if (email) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      // If no user or email is found => Success
      next();
    });
  });
};

/**
 * Check if Role existed
 */
checkRolesExisted = (req, res, next) => {
  // If Request has Roles ->
  if (req.body.roles) {
    // Iterate through Roles ->
    for (let i = 0; i < req.body.roles.length; i++) {
      // If Roles are not found in Roles Object ->
      if (!ROLES.includes(req.body.roles[i])) {
        // Return Status 400 => Role does not exist => Fail
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
