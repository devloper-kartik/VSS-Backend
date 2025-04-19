const express=require('express')
const router=express.Router()
const DispatchController=require('../controller/Dispatch_manager')

router.get('/ShowOrders', DispatchController.Showorderdetails)
router.patch('/recivedOrder',DispatchController.RecivedOrder)

module.exports=router