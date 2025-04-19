const express = require("express");
const router = express.Router();

const recentOrderController = require('../controller/recentOrder');

router.get("/get/",recentOrderController.getrecentOrder);

module.exports = router;
