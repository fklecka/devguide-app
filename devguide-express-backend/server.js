const express = require("express");
const cors = require("cors");
const { urlencoded } = require("express");
const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

// Add Cors to Applikation
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-ww-form-urlencoded
app.use(express(urlencoded({ extended: true })));

/**
 * Connect Mongoose
 */
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Role = db.role;

//Connect to Database via Mongoose
db.mongoose
  //Connect to Database
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // If connection is successfull => Run inital Function to create Roles if none exist
  .then(() => {
    console.log("Successfully connect to MongoDB");
    initial();
  })
  // If connection failed => return error => Exit Process
  .catch((err) => {
    console.log("Connection Error", err);
    process.exit();
  });

/**
 * Create Roles in Collection if none exist
 */
function initial() {
  // Check Metadata for number of Roles
  Role.estimatedDocumentCount((err, count) => {
    // If no Roles exist and no error occures ->
    if (!err && count == 0) {
      // Create a new Role "user"
      new Role({
        name: "user",
      }).save((err) => {
        // If we get an error => return error
        if (err) {
          console.log("error", err);
        }
        // If we get no error => Role is added => Success
        console.log("added 'user' to roles collection");
      });
      // Create a new Role "admin"
      new Role({
        name: "admin",
      }).save((err) => {
        // If we get an error => return error
        if (err) {
          console.log("error", err);
        }
        // If we get no error => Role is added => Success
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

/**
 * Starting Route / Test if Server is running
 */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my Express Server" });
});

/**
 * Add Routes from Routes Folder
 */
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

/**
 * Set Port the Server should listen to
 */
// Get Port from Env File
const PORT = process.env.PORT || 8080;
// Set Port the Server should listen to
app.listen(PORT, () => {
  // Return Message with Port
  console.log(`Server is running in port ${PORT}.`);
});
