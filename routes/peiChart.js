const express = require("express");
const router = express.Router();

const peiChartController = require('../controller/peiChartcontroller');

router.get("/getstock/", peiChartController.getSoldProduct);
router.get("/getallstock/", peiChartController.getAllSoldProduct);
router.get("/get/",peiChartController.getTotalReadymade);




module.exports = router;
