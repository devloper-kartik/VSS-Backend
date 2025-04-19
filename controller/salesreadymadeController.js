const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')
const multer = require('multer')
const app= express();
const readymadeProducts = require("../models/salesreadymade");


//create
exports.create = async(req,res,upload) => {
  //upload image by multer
 
  var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
    callback(null, "./images");
    },
    
    filename: function(req, file, callback) {
      //var path="http://13.126.107.114/api/v1/";
    callback(null,file.fieldname+ "_" + Date.now() + "_" + file.originalname);
    }
  });
 
  var upload = multer({
  storage: Storage
  }).single("productPictures_img"); //Field name and max count

  upload(req,res,function(err){
    const user = new readymadeProducts({
    productId: req.body.productId,
    select_product: req.body.select_product,
    company: req.body.company,
    grade: req.body.grade,
    topcolor: req.body.topcolor,
    coatingnum: req.body.coatingnum,
    temper: req.body.temper,
    guardfilm: req.body.guardfilm,
    width: req.body.width,
    length: req.body.length,
    thickness: req.body.thickness,
    pcs:req.body.pcs,
    weight:req.body.weight,
    ready_production:req.body.ready_production,
    note:req.body.note,
    //productPictures_img:'http://13.126.107.114/api/v1//salesreadymade/productPicture/'+req.file.filename
    productPictures_img:'65.0.129.68/api/v1/salesreadymade/productPicture/'+req.file.filename
  })

    
    user.save(function(error){
    if(error)
    {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
    else
    {
     res.status(200).json({ message: "Record Created",user });
    }
  })
  
})
}  

//get
exports.get = async (req, res) => {
  // Rest of the code will go here
  const userList = await readymadeProducts.findById(req.params.id);   ////
  res.json({"status": 200, "msg": 'data has been fetched', res: userList });   //

}

//Put One
exports.edit = async (req, res) => {
  try {
    const user_data = await readymadeProducts.findById(req.params.id);
    if(user_data){
      const updatedUser = await readymadeProducts.findById(req.params.id).exec();
      updatedUser.set(req.body);
      var result = await updatedUser.save();
      res.status(201).json({ "status": 200, "msg": 'record sucessfully updated',result });
    }
    else{
      res.json({ status:"400",message: "No Record found" });

    }

    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// delete
exports.delete = async (req, res) => {
  try {
    const user_data= await readymadeProducts.findById(req.params.id);
    if(user_data){
      await readymadeProducts.findById(req.params.id).deleteOne();
      res.json({ status:"200",message: "User has been deleted " });
    }else
    {
        res.json({ status:"400",message: "No Record found" });
    }
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//pagination 
exports.allRecords = async (req, res) => {
  // Rest of the code will go here
  try {
    const resPerPage = 10; // results per page
    const page = req.params.page || 1; // Page 
    //const userList = await readymadeProducts.find().skip((resPerPage * page) - resPerPage).limit(resPerPage);  ////
    const userList = await readymadeProducts.find().sort({'_id':-1});
    res.json({"status": 200, "msg": 'data has been fetched', res: userList });
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
