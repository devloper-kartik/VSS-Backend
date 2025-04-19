const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
// Create One Route
router.post('/login', adminController.auth);
router.get('/changestatus',adminController.changeStatus);
router.get('/checkstatus',adminController.checkStatus);
router.put('/manualchanges',adminController.manualchanges);
router.post('/createUser',adminController.createUser)
router.delete('/deleteUser/:id', adminController.deleteUser);
router.post('/logout',adminController.logout)
module.exports = router;