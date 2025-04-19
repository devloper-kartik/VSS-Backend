const express = require("express");
const router = express.Router();

const purchaseManagementController = require("../controller/purchaseManagementcontroller");

router.post("/create/", purchaseManagementController.create);
router.get("/get/", purchaseManagementController.get);
router.get("/by/:id", purchaseManagementController.getbyone);
router.put("/edit/:id", purchaseManagementController.edit);
router.delete("/delete/:id", purchaseManagementController.delete);

module.exports = router;
