const mongoose = require("mongoose");

/**
 * Create Model for Roles
 */
const Role = mongoose.model("Role", new mongoose.Schema({ name: String }));

module.exports = Role;
