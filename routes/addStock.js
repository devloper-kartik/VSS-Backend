const express = require("express");
const router = express.Router();

const addStockController = require("../controller/addStockController");

router.post("/create", addStockController.create);
// ---------------------Redis------------------------
const redis_stock = (req, res, next) => {
  client.get("get", (err, redis_stock) => {
    if (err) {
      throw err;
    } else if (redis_stock) {
      res.send(JSON.parse(redis_stock));
      console.log("redis data");
    } else {
      next();
    }
  });
};


// ------------------------------------
router.get("/get/:purchaseNumber", addStockController.get);
router.put("/edit/:purchaseNumber", addStockController.edit);
router.delete("/delete/:purchaseNumber", addStockController.delete);
module.exports = router;


