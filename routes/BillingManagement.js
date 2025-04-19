const express = require("express");
const router = express.Router();
const billing_Controller = require('../controller/BillingController')

const jwt = require('jsonwebtoken');
function token (req, res, next) {
  // Implement the middleware function based on the options object
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
};
//----------------------------------------
// Get All Route
router.get("/all", token, billing_Controller.allRecords);

router.get("/all2",token, billing_Controller.getRecords);

router.post("/all3",token, billing_Controller.AllRecordbyPrid);
//----------------------------------------
//GET with Date Filter
router.get("/all_with_Date", token,billing_Controller.get);

router.get("/all2_with_Date",billing_Controller.getSalesIdAndDate);

router.post("/all3_with_Date", token,billing_Controller.AllRecordbyid);

router.get("/Dispatch_with_Date", token,billing_Controller.getOrderstatusAndDate);
router.get("/RecentWeeklyOrder", token,billing_Controller.recentweekorder);
router.get("/Orders", token,billing_Controller.orderwithDeliveryDate);
//----------------------------------------
              // Get One Route
router.get("/get/:id", token, billing_Controller.getbyid);

              // Create One Route
router.post("/create/", token, billing_Controller.create);

              //Put One
router.put("/edit/:id", token, billing_Controller.edit);

              // Edit One Route PATCH version

router.patch("/:id", async (req, res) => {
            // Rest of the code will go here
});
              //Delete One
router.delete("/delete/:id", token, billing_Controller.delete);



//for update in product array

router.get("/gt/:id", token, billing_Controller.gt);
router.post("/gt/:id", token, billing_Controller.updatebyid);
router.get("/allRecords",token,billing_Controller.allRecords)
router.get('/billing', billing_Controller.Billing)
router.get('/billing/:id' , billing_Controller.BillingById)


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