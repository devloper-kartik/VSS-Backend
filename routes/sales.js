const express = require("express");
const router = express.Router();
const salesController = require("../controller/salesController");
const token = require("../middleware/token");

// Get All Route
router.get("/", token,salesController.allRecords);
// Get One Route
router.get("/get/:id", token, salesController.get);

router.get("/availableStock", token, salesController.availableStock);

router.post("/checkStock",  salesController.checkStocks);




// Create One Route
router.post("/create", token, salesController.create);
//Put One
router.put("/edit/:id", token, salesController.edit);
// Edit One Route PATCH version
router.patch("/:id", async (req, res) => {
  // Rest of the code will go here
});
//Delete One
router.delete("/delete/:id", token, salesController.delete);

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