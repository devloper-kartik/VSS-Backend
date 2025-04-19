const express = require("express");
const router = express.Router();

const usermanagementController = require("../controller/usermanagementController");
const jwt = require('jsonwebtoken');
const secretkey = process.env.SECRETKEY;
// Create One Route
router.post("/", usermanagementController.login);

module.exports = router;