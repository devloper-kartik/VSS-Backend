const express = require("express");
const router = express.Router();



const CurrentController = require('../controller/CurrentController');

router.get("/get/", CurrentController.getAll);
router.get("/getstatus/", CurrentController.getPendingSales);


module.exports = router;

