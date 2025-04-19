const express=require('express')
const router=express.Router()

const mobileController = require('../controller/Mobilelogin');


router.post('/MobileReg', mobileController.uploadSingle, mobileController.create);
router.post('/MobileLogin',mobileController.login)
router.get('/checkDeatils',mobileController.get)
router.get("/checkDetailsNew" , mobileController.Newget)
router.get('/getById/:id', mobileController.getbyId)
router.patch('/update/:id',mobileController.update)
router.delete('/delete/:id',mobileController.delete)

module.exports=router;