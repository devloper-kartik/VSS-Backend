const fs = require('fs')
const multer = require('multer')
const UserManagement = require('../models/user_management');
const jwt = require('jsonwebtoken');
var md5 = require('md5');
const secretkey = process.env.SECRETKEY;
const mongoose = require('mongoose');

// exports.login = async (req,res) => {
//     // Rest of the code will go here

//     try {
        
//        const newUser = await UserManagement.findOne({ 'phone_no': req.body.phone_no, 'password': md5(req.body.password) });

//         if (newUser != '' && newUser != null) {
//             jwt.sign({ newUser }, 'secretkey', { expiresIn: '24h' }, (err, token) => {
//                 res.status(200).json(
//                     {
//                         "status": "200",
//                         "message": "Successfully LogedIn",
//                         "data": {
//                             "_id": newUser['_id'],
//                             "user_id": newUser['user_id'],
//                             "role": newUser['role'],
//                             "firstName": newUser['firstName'],
//                             "lastName": newUser['lastName'],
//                             "phone_no": newUser['phone_no'],
//                             "email": newUser['email'],
//                             "address": newUser['address'],
//                             "city": newUser['city'],
//                             "pincode": newUser['pincode'],
//                             "joined_date": newUser['joined_date'],
//                             "shift_time": newUser['shift_time'],
//                             "tenure": newUser['tenure'],
//                             "user_image":newUser['user_image'],
//                             token
//                         }
//                     });

//             });


//         }
//         else {
//             res.status(200).json({ "status": "200", "message": "no record found" });

//         }


//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

exports.login = async (req, res) => {
    try {
      const { phone_no, password } = req.body;
      const user = await UserManagement.findOne({ phone_no, password: md5(password) });
  
      if (user) {
        const token = jwt.sign({ user }, 'secretkey', { expiresIn: '24h' });
        res.status(200).json({
          status: 200,
          message: 'Successfully Logged In',
          data: {
            _id: user._id,
            user_id: user.user_id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            phone_no: user.phone_no,
            email: user.email,
            address: user.address,
            city: user.city,
            pincode: user.pincode,
            joined_date: user.joined_date,
            shift_time: user.shift_time,
            tenure: user.tenure,
            user_image: user.user_image,
            token
          }
        });
      } else {
        res.status(200).json({ status: 200, message: 'No record found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
//create

// exports.create = async (req, res) => {
    
//     try{
//         const {phone_no}=req.body;
//        const newUser= await UserManagement.findOne({phone_no});
//            if(!newUser){
//             var Storage = multer.diskStorage({
//                 destination: function(req, file, callback) {
//                 callback(null, "./User_Profile_Images");
//                 },
                
//                 filename: function(req, file, callback) {
//                   //var path="http://13.126.107.114/api/v1/";
//                 callback(null,file.fieldname+ "_" + Date.now() + "_" + file.originalname);
//                 }
//               });
             
//               var upload = multer({
//                 storage: Storage
//                 }).single("user_image"); //Field name and max count 
               
//                 upload(req,res,function(err){
//                     const user = new UserManagement({
//                     firstName: req.body.firstName,
//                     lastName: req.body.lastName,
//                     phone_no: req.body.phone_no,
//                     role: req.body.role,
//                     email: req.body.email,
//                     address: req.body.address,
//                     city: req.body.city,
//                     pincode: req.body.pincode,
//                     joined_date: req.body.joined_date,
//                     shift_time: req.body.shift_time,
//                     tenure: req.body.tenure,
//                     user_id: req.body.user_id,
//                     password: md5(req.body.password),
//                     user_image:'65.0.129.68/api/v1/user_management/profilePicture/'+req.file.filename  
//                     });
                
//                  user.save((err,data) => {
//                         if (err) {
//                             return res.status(200).send({ message: "User Already Existed With this Phone Number" });
//                         } else{
//                            return res.status(201).json({ message: "user created", data });  
//                         }
//                       });

//                })
//             }
//       else {
//             return res
//               .status(200)
//               .send({ status: 200, message: "User Already Exist" });
//           }
            
//     }catch(err){
//         console.log(err);
//         res.status(400).json({message:"Somthing Went Wrong"});
//     }
// }



exports.create = async (req, res) => {
    try {
      const { phone_no } = req.body;
      const newUser = await UserManagement.findOne({ phone_no });
      
      if (!newUser) {
        var Storage = multer.diskStorage({
          destination: function (req, file, callback) {
            callback(null, "./User_Profile_Images");
          },
          filename: function (req, file, callback) {
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
          },
        });
  
        var upload = multer({ storage: Storage }).single("user_image");
  
        upload(req, res, function (err) {
          if (req.file) { // Check if req.file exists
            const user = new UserManagement({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              phone_no: req.body.phone_no,
              role: req.body.role,
              email: req.body.email,
              address: req.body.address,
              city: req.body.city,
              pincode: req.body.pincode,
              joined_date: req.body.joined_date,
              shift_time: req.body.shift_time,
              tenure: req.body.tenure,
              user_id: req.body.user_id,
              password: md5(req.body.password),
              user_image: '65.0.129.68/api/v1/user_management/profilePicture/'+req.file.filename
            });
  
            user.save((err, data) => {
              if (err) {
                return res.status(200).send({ message: "User Already Exists With this Phone Number" });
              } else {
                return res.status(201).json({ message: "User created", data });
              }
            });
          } else {
            // Handle case when no file is uploaded
            return res.status(400).json({ message: "No file uploaded" });
          }
        });
      } else {
        return res.status(200).send({ status: 200, message: "User Already Exists" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  };
  
//find role
exports.role= async (req, res) => {
    // Rest of the code will go here
    const userList = await UserManagement.find({"role":req.params.role});
    res.json({ "status": 200, "msg": 'data has been fetched', res: userList });
}


//get
exports.get = async (req, res) => {
    // Rest of the code will go here
    const userList = await UserManagement.findById(req.params.id);
    if(userList)
        {
            res.json({ "status": 200, "msg": 'data has been fetched', res: userList });
        }else
        {
            res.json({ status:"400",message: "No Record found" });
        }
    
}

//Put One
exports.edit = async (req, res) => {
    try {
        //  console.log(req.body);
        console.log(req.params.id);
        const user_data = await UserManagement.findById(req.params.id);

        if(user_data){
            const updatedUser = await UserManagement.findById(req.params.id).exec();
            updatedUser.set(req.body);
            var result = await updatedUser.save();
            res.status(201).json({ "status": 200, "msg": 'record sucessfully updated', result });
        }else
           {
            res.json({ status:"400",message: "No Record found" });
           }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

//delete
exports.delete = async (req, res) => {
    try {
       const user_data= await UserManagement.findById(req.params.id);
       if(user_data){
        await UserManagement.findById(req.params.id).deleteOne();
        res.json({ status:"200",message: "User has been deleted " });
       }else
       {
           res.json({ status:"400",message: "No Record found" });
       }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.allRecords = async (req,res,next)=>{
    
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const amaid =parseInt(req.query.asid)
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total_doc= await UserManagement.countDocuments().exec()
    const result = {};
    if (endIndex < (await UserManagement.countDocuments().exec())) {
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
    try {
      result.results = await UserManagement.find().sort({_id:-1}).limit(limit).skip(startIndex);
      res.paginatedResult = result;
      res.status(201).json({ "status": 200, "msg": 'records get', "output":res.paginatedResult });
    }
    catch (e) {
      res.status(500).json({ message: e.message });
  }
}

