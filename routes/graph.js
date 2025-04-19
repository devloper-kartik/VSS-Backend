const express = require("express");
const router = express.Router();

const graphController = require('../controller/graph');

router.get("/get/", graphController.getdata);
router.get("/getadmin/", graphController.getWeeklyData);
router.get("/getsales", graphController.getAlldata);

module.exports = router;