const express = require("express");
const router = express.Router();
const totalController = require('../controller/totalcontroller');
router.get("/get/", totalController.getTotal);
router.get("/getadmin/", totalController.getTotalAdmin);
router.get("/getadmin/totalDelivery", totalController.getTotalDelivary);
module.exports = router;