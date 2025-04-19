const express=require('express')
const router=express.Router()
const ManagerLogin=require('../controller/stockManager')
router.route('/login').post(ManagerLogin.login)
router.route('/Addstocks').post(ManagerLogin.create)
router.route('/get/:purchaseNumber').get(ManagerLogin.get)
router.route('/edit/:purchaseNumber').put(ManagerLogin.edit)
router.route('/delete/:purchaseNumber').delete(ManagerLogin.delete)

// router.route('/Register').post(ManagerLogin.createuser)
module.exports=router;
