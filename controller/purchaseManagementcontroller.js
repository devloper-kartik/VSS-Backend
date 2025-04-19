const { Mongoose } = require("mongoose");
const PurchaseStock = require("../models/purchaseStockSchema");
const nodemailer = require('nodemailer');
const { response } = require("express");
//checked
exports.create = async(req, res) => {
    const stock = new PurchaseStock({
        orderdate: req.body.orderdate,
        vendor: req.body.vendor,
        email: req.body.email,
        deliveryDate: req.body.deliveryDate,
        rate_TN: req.body.rate_TN,
        quantity: req.body.quantity,
        purchaseNumber: req.body.vendor + "-" + req.body.orderdate,
        sales_id: req.body.sales_id,
        sales_name: req.body.sales_name,
        orderStatus: req.body.orderStatus,
        purchaseId: req.body.purchaseId,
        arrivedate: req.body.arrivedate,
        clientName: req.body.clientName,
        firmName: req.body.firmName,
        address: req.body.address,
        city: req.body.city,
        phone_no: req.body.phone_no,
        note: req.body.note,
        products:req.body.products
    });
    // email send..........
    function email(stock) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.yahoo.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'viveksteelsindore@yahoo.com',
                pass: 'sysedit88'
            }
        });
        const mailOptions = {
            from: 'viveksteelsindore@yahoo.com',
            to: req.body.email,
            //body: { body: JSON.stringify(stock) },
            subject: 'this is purchase mail',
            text: `${stock}`
        }
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("mail has been done", info.response);
            }
        });
    }
    email(stock);
    try {
        const purStock = await stock.save();
        res.status(200).json({ purStock });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// get all
exports.get = async(req, res) => {
    const page = parseInt(req.query.page);
              const limit = parseInt(req.query.limit);
              const amaid =parseInt(req.query.asid)
              const startIndex = (page - 1) * limit;
              const endIndex = page * limit;
              const total_doc= await PurchaseStock.countDocuments().exec()
              const result = {};
              if (endIndex < (await PurchaseStock.countDocuments().exec())) {
                result.next = {
                  page: page + 1,
                  limit: limit,
                  total_doc:Math.round (total_doc/limit)
                };
              }
              if (startIndex > 0) {
                result.previous = {
                  page: page - 1,
                  limit: limit,
                  total_doc:Math.round (total_doc/limit)
                };
              }
            const stock_ = await PurchaseStock.find().sort({_id:-1}).limit(limit).skip(startIndex);
            res.json({ "status": 200, "msg": 'data has been fetched', res: stock_ });
};
// get one................
exports.getbyone = async(req, res) => {
    const stock_data = await PurchaseStock.findById(req.params.id);
    if(stock_data){
        res.json({ "status": 200, "msg": 'data has been fetched', res: stock_data });
    }else
    {
        res.json({ status:"400",message: "No Record found" });
    }
    
};
// put one ................
exports.edit = async(req, res) => {
    try {
        const updatedPurchaseStock = await PurchaseStock.findByIdAndUpdate(req.params.id);
        if(updatedPurchaseStock){
            const updatedPurchaseStock = await PurchaseStock.findByIdAndUpdate(req.params.id).exec();
            updatedPurchaseStock.set(req.body);
            var result = await updatedPurchaseStock.save();
            res.status(201).json({ "status": 200, "msg": 'record sucessfully updated', result });
        }
        else{
            res.json({ status:"400",message: "No Record found" });
         }
       
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// delete one...............
exports.delete = async(req, res) => {
    try {
        console.log(req.params.id);
        const purchasedata = await PurchaseStock.findById(req.params.id);
        if(purchasedata){
            await PurchaseStock.findById(req.params.id).deleteOne();
            res.json({ status:"200",message: "User has been deleted " });
        }else
           {
            res.json({ status:"201",message: "No Record found" });
           }
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};