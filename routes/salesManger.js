const express = require("express");
const router = express.Router();

const salesManger = require('../controller/salesManger');

router.get("/get/", salesManger.getSalesManger);
router.get('/Totalweight', salesManger.availableProduct)


module.exports = router;