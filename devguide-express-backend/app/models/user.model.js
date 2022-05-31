const mongoose = require("mongoose");

/**
 * Create Model for User
 * User consists of username, email, password and a role
 * Roles are referenced to Role Model
 */
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = User;
