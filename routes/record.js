const express = require("express");
const router = express.Router();

const recordController = require('../controller/recordcontroller');

router.get("/get/", recordController.getTotal);

module.exports = router;