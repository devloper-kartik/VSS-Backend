// const Adminlogin = require("../models/admin");
// const session = require('express-session')
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt')
// const secretkey = process.env.SECRETKEY;

// // Login by stock Manager

// exports.login = async (req, res) => {
//     try {
//         const { username, password } = req.body
//         const data = await Adminlogin.findOne({ username: username })
//         if (data) {
//             const ismatch = await bcrypt.compare(password, Adminlogin.password)
//             if (ismatch) {
//                 const token = await jwt.sign({
//                     username: Adminlogin.username,
//                     password: Adminlogin.password
//                 },
//                     secretkey,
//                     {

//                         expiresIn: '24h'

//                     }
//                 );
//                 jwt.verify(token, secretkey, (err, Decode) => {
//                     if (err) {
//                         console.log("Token is not verified")
//                     }
//                     else {
//                         console.log("Token is verfied . Decoded payload:", decoded)
//                     }
//                 })
//                 res.status(200).json({
//                     username:Adminlogin.username,
//                     password:Adminlogin.password
//                 })
//             }
//             else{
//                 res.status(401).json({msg:'Invalid email and password'})
//             }
//         }
//         else{
//             res.status(401).json({msg:'Email not Found'});

//         }
//     }
//     catch (error) {
//        console.log(error)
//        res.status(500).json({msg:`Internal server error`})
//     }
// }
const Adminlogin = require("../models/admin");
const AddStock = require("../models/addStockSchema");
const session = require('express-session')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const secretkey = process.env.SECRETKEY;
// const redis = require('redis');
// const client = redis.createClient();



// exports.createuser = async (req, res) => {
//     try {
//       const hashpassword = await bcrypt.hash(req.body.password, 10);
//       let data = new Adminlogin({
//        username:req.body.username,
//         password: hashpassword,
//       });
  
//       await data.save();
//       console.log(`Data has been saved: ${data}`);
//       // res.send(`Data has been saved: ${data}`);
//       res.status(200).json({data:data})
  
//     } catch (error) {
//       console.log('Data is not created', error);
//       res.status(500).json("Data is not created");
//     }
//   };


// login by stock manager
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Adminlogin.findOne({ username: username });
        
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            
            if (isMatch) {
                const token = jwt.sign({
                    username: admin.username,
                    password: admin.password
                }, secretkey, {
                    expiresIn: '24h'
                });

                jwt.verify(token, secretkey, (err, decoded) => {
                    if (err) {
                        console.log("Token is not verified");
                    } else {
                        console.log("Token is verified. Decoded payload:", decoded);
                    }
                });

                res.status(200).json({
                    username: admin.username,
                    password: admin.password,
                    token: token
                });
            } else {
                res.status(401).json({ msg: 'Invalid email or password' });
            }
        } else {
            res.status(401).json({ msg: 'Email not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }

};
exports.create = async (req, res) => {
  try {
    const user = new AddStock({
      item: req.body.item,
      company: req.body.company,
      length: req.body.length,
      width: req.body.width,
      topColor: req.body.topColor,
      thickness: req.body.thickness,
      temper: req.body.temper,
      coating: req.body.coating,
      grade: req.body.grade,
      guardFilm: req.body.guardFilm,
      batchNumber: req.body.batchNumber,
      purchaseNumber: req.body.purchaseNumber
    });

    const newUser = await user.save();
    res.status(200).json({ newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// client.on('error', (err) => {
//   console.error('Redis error:', err);
// });

// client.on('connect', () => {
//   console.log('Connected to Redis server');
// });

exports.get = async (req, res) => {
  try {
    console.log('Fetching data');
    const stock = await AddStock.findOne({ purchaseNumber: req.params.purchaseNumber });

    client.SETEX(req.params.purchaseNumber, 60, JSON.stringify(stock), (err, result) => {
      if (err) {
        console.error('Redis command error:', err);
        res.status(500).json({ error: err.message });
      } else {
        console.log('Redis command result:', result);
        res.json({ result: result });
      }
    });

    res.json({ res: stock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.edit = async (req, res) => {
  try {
    const updatedAddStock = await AddStock.findOneAndUpdate({ purchaseNumber: req.params.purchaseNumber }, req.body, { new: true });
    res.json(updatedAddStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await AddStock.findOneAndDelete({ purchaseNumber: req.params.purchaseNumber });
    res.json({ message: "Stock has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
