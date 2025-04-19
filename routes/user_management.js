const express = require("express");
const router = express.Router();
const UserManagement = require('../models/user_management');
const token = require("../middleware/token");
const usermanagementController = require("../controller/usermanagementController");
const AWS = require('aws-sdk');
const multer = require('multer');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // For password hashing
dotenv.config();



// Configure AWS
AWS.config.update({
  region:'ap-south-1',
  accessKeyId: 'AKIATFBMO7JVESQOX5UO',
  secretAccessKey: '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'
});

const S3 = new AWS.S3();

// Configure Multer
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5mb
  },
  fileFilter: (req, file, done) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      done(null, true);
    } else {
      done(new Error('Unsupported file format. Only JPEG, PNG, and JPG formats are allowed.'), false);
    }
  },
});

// Function to Upload to S3
const uploadToS3 = (fileData) => {
  const params = {
    Bucket: 'vss-project',
    Key: `${Date.now().toString()}.png`,
    Body: fileData
  };

  return new Promise((resolve, reject) => {
    S3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading image to S3', err);
        reject(err);
      } else {
        console.log('S3 upload result', data);
        resolve(data);
      }
    });
  });
};

router.post('/createData', upload.single('user_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "error", message: 'Image is not provided' });
    }

    const s3UploadResult = await uploadToS3(req.file.buffer);

    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password

    // Check if a user with the same phone_no already exists
    const { phone_no } = req.body;
    const existingUser = await UserManagement.findOne({ phone_no });

    if (existingUser) {
      return res.status(400).json({ status: "error", message: 'User with this phone number already exists' });
    }

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
      password: hashedPassword, // Store the hashed password
      user_image: s3UploadResult.Location
    });

    user.save((err, data) => {
      if (err) {
        console.error('Error saving user data to MongoDB', err);
        return res.status(500).json({ status: "error", message: "There is some problem" });
      } else if (data) {
        return res.status(200).json({    
        message: 'File uploaded and data inserted successfully',
        user_image: s3UploadResult.Location,
        data: user
       });
      }
    });
  } catch (error) {
    console.error('An error occurred', error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
});






// Get All Route
router.get("/",token, usermanagementController.allRecords);
// Get One Route
router.get("/:id", token, usermanagementController.get);
//find by role
router.get("/role/:role", token, usermanagementController.role);
// Create One Route
router.post("/create", token, usermanagementController.create);
//Put One 

router.post("/login",token,usermanagementController.login)
router.put("/edit/:id", token, usermanagementController.edit);

//image open in browser
router.use('/profilePicture', express.static('User_Profile_Images'));

//Delete One
router.delete("/delete/:id", token, usermanagementController.delete);

// token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

module.exports = router;