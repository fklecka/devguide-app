/**
 * Controller for testing Authorization
 */

//Public Access Test
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content");
};

//User Access test
exports.userBoard = (req, res) => {
  res.status(200).send("User Content");
};

//Admin Access Test
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content");
};
