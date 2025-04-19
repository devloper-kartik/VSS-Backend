const express = require("express");
const router = express.Router();
const token = require("../middleware/token");
const salesreadymadeController = require("../controller/salesreadymadeController");
// Get All Route
  router.get("/", token, salesreadymadeController.allRecords);
// Get One Route
   router.get("/get/:id", token, salesreadymadeController.get);
// Create One Route
router.post("/create", token, salesreadymadeController.create);
//Put One
  router.put("/edit/:id", token, salesreadymadeController.edit);
// Edit One Route PATCH version
  
//Delete One
  router.delete("/delete/:id", token, salesreadymadeController.delete);

  router.use('/productPicture', express.static('images'));
// token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

module.exports = router;