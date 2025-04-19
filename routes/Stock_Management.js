const express = require("express");
const router = express.Router();

const Stock_Controller = require('../controller/StockController');

router.post("/create", Stock_Controller.create);
router.get("/get", Stock_Controller.allRecords);
router.get("/getby/:id", Stock_Controller.getbyid);
router.put("/edit/:id", Stock_Controller.edit);
router.delete("/delete/:id",Stock_Controller.delete);
router.get("/Sum", Stock_Controller.Manoj)
router.post("/batch_list", Stock_Controller.batch_list)

module.exports = router;                         
