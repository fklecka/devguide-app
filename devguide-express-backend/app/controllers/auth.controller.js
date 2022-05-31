const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * User Sign Up Funktion
 *
 * @param {*} req
 * @param {*} res
 */
exports.signup = (req, res) => {
  //Create User from Request
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  // Attempt to save User
  user.save((err, user) => {
    // If we get an error => Return Error
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    }
    // If Request has Role specified
    if (req.body.roles) {
      // Find Role
      Role.find({ name: { $in: req.body.roles } }, (err, roles) => {
        // If we get an Error => Return Error
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        // Set Role in User
        user.roles = roles.map((role) => role._id);
        // Attempt to save User
        user.save((err) => {
          // If we get an Error => Return Error
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          // If no error => User successfully created. => Return Success Message
          res.send({ message: "User was registered successfully!" });
        });
      });
    } else {
      // If no Role was specified find "user" Role
      Role.findOne({ name: "user" }, (err, role) => {
        // If we get an error => Return Error
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        // Set Role in User
        user.roles = [role._id];
        // Attempt to save User
        user.save((err) => {
          // If we get an error => Return Error
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          // If no error => User successfully created. => Return Success Message
          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

/**
 * User Sign in Funktion
 *
 * @param {*} req
 * @param {*} err
 */
exports.signin = (req, res) => {
  // Attempt to find User
  User.findOne({
    username: req.body.username,
  })
    // Populate search with Roles
    .populate("roles", "-__V")
    .exec((err, user) => {
      // If we get an error => return Error
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // If no User is found => Return Error
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      // Check if Password is Valid
      let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      // If Password is not valid => return Error
      if (!passwordIsValid) {
        return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
      }
      // Create Login Token
      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      // Create User Authorities on Applikation and push them into User
      let authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      // If everything is ok => Return User Object
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
