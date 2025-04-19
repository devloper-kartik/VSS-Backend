const express = require("express");
const router = express.Router();

const order_Notice_Controller = require('../controller/OrderNoticeController');

router.post("/create", order_Notice_Controller.create);
router.get("/get", order_Notice_Controller.get);

module.exports = router;