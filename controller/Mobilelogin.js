const Mobilelogin = require('../models/mobile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keyvalue = process.env.KEY;
// const redisClient = require('../config/redis');
const { promisify } = require('util');
const { json } = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const multer = require('multer'); // Import Multer

AWS.config.update({
  accessKeyId: "RmBp5xOKWdH1q3/2k5KsDIZl5R/6tGF8vP7dLtj8",
  secretAccessKey: "AKIATFBMO7JVESQOX5UO",
  region: 'ap-south-1',
});

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID ,
  secretAccessKey: process.env. SECRET_ACCESS_KEY,
  region: 'ap-south-1',
  signatureVersion: 'v4', // Add this if the bucket uses v4 signatures
});


// Define the fileFilter function for multer
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};



// Configure multer with the fileFilter function
const upload = multer({ fileFilter });

// Export the upload middleware
exports.uploadSingle = upload.single('ProfileImage');

exports.create = async (req, res) => {
  try {
    const { UserName, Password, Status, Role, Phone, LastName , CurrentDate, Tenure } = req.body;

    console.log("UserName is ", UserName);

    // Multer middleware will handle the file upload
    exports.uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed' });
      }

      // Access the uploaded file from req.file
      const ProfileImage = req.file;
      console.log(ProfileImage)

      if (!ProfileImage) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Ensure that ProfileImage.buffer is accessible and not undefined
      if (!ProfileImage.buffer || ProfileImage.buffer.length === 0) {
        return res.status(400).json({ error: 'Uploaded file buffer is empty or undefined' });
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(Password, 10);
      const bucketName = 'vss-project';
      // Upload image to S3
      const uploadParams = {
        Bucket: bucketName, // Update with your S3 bucket name
        Key: `profile-images/${UserName}-${Date.now()}`,
        Body: ProfileImage.buffer, // Use the uploaded file buffer
        ContentType: ProfileImage.mimetype // Use the uploaded file's MIME type
      };

      const s3UploadResponse = await s3.upload(uploadParams).promise();
      const imageUrl = s3UploadResponse.Location;

      const localUploadsDir = path.join(__dirname, 'uploads');

      // Check if the uploads directory exists, create it if not
      if (!fs.existsSync(localUploadsDir)) {
        fs.mkdirSync(localUploadsDir, { recursive: true });
      }

      // Save the file locally
      const localFilePath = path.join(localUploadsDir, ProfileImage.originalname);
      fs.writeFileSync(localFilePath, ProfileImage.buffer);


      // Create a new Mobilelogin user
      const mobileUser = new Mobilelogin({
        UserName: UserName,
        Password: hashedPassword,
        Status: Status,
        Role: Role,
        Phone: Phone,
        LastName: LastName,
        ProfileImage: imageUrl || 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png', // Use the uploaded image URL
        LocalProfileImage: localFilePath || 'Nothing', // Store local file path in database
        Tenure:Tenure,
        CurrentDate:CurrentDate || Date.now()
      });

      
      // Save the new user to the database
      const savedUser = await mobileUser.save();
      console.log("data", savedUser);

      res.status(200).json({ message: 'User created successfully', user: savedUser });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// const getAsync = promisify(redisClient.get).bind(redisClient);
// const setExAsync = promisify(redisClient.setex).bind(redisClient);

exports.get = async (req, res) => {
  try {
    // const key = 'getdata';

    // if (!redisClient.connected) {
    //   console.error('Redis Client is not connected');
    //   return res.status(500).json({
    //     message: 'Redis Client is not connected'
    //   });
    // }

    // const cachedData = await getAsync(key);

    // if (cachedData) {
    //   console.log('Data retrieved from cache', JSON.parse(cachedData));
    //   return res.json({ data: JSON.parse(cachedData) });
    // }

    const getData = await Mobilelogin.find({});

    if (getData.length > 0) {
      // await setExAsync(key, 3600, JSON.stringify(getData));
      return res.json({ data: getData });
    } else {
      console.log('No data found');
      return res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};


exports.Newget = async (req, res) => {
  try {
    const getData = await Mobilelogin.find({ Role: { $in: ['ProductionIncharge', 'Dispatchmanager'] } });

    if (!getData || getData.length === 0) {
      console.error('❌ No data found for the specified roles.');
      return res.status(404).json({ error: 'No data found' });
    }

    return res.status(200).json({ data: getData });

  } catch (error) {
    console.error('🚨 Error fetching data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




// Get data by Id //

exports.getbyId=async(req,res)=>{
  try{

    const fatchdata= req.params.id
    const fatchdatabyId=await Mobilelogin.findById(fatchdata)
    if(!fatchdatabyId){
      res.status(400).json({
        message:'User Is Not Found'
      })
    }
    res.status(200).json({
      message:fatchdatabyId
    })

  }catch(error){
   res.status(500).json({
   Message:error.message
   })
  }
}



exports.login = async (req, res) => {
  try {
    const { UserName, Password, Role } = req.body;

    // Find the user by username in the database
    const user = await Mobilelogin.findOne({ UserName, Role });
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(Password, user.Password);

    console.log("Password match is", passwordMatch)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, username: user.UserName }, keyvalue, { expiresIn: '24h' });

    res.status(200).json({
      status: true,
      data: {
        _id: user._id,
        UserName: user.UserName,
        Role: user.Role,
        token,
      },
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


 // Update User Data //

exports.update = async (req, res) => {

  const PasswordWithOutHashed=req.body.Password
  const PasswordSalt= await bcrypt.genSalt(10)
  const hashedPassword= await bcrypt.hash(PasswordWithOutHashed,PasswordSalt)
  console.log(hashedPassword)
  const paramsId = req.params.id;

  try {
    let findData = await Mobilelogin.findOne({ _id: paramsId });
    
    if (!findData) {
      return res.status(404).json({ error: 'User with provided ID not found' });
    }
    const updateObj={
      ...req.body,
      Password:hashedPassword
    }

    const updatedUser = await Mobilelogin.findOneAndUpdate(
      { _id: paramsId },
      updateObj,
      { new: true }
    );

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


 // Delete The User Data //

 exports.delete = async (req, res) => {
  try {
    const deleteId = req.params.id;
    const deleteUser = await Mobilelogin.findOneAndDelete({ _id: deleteId });

    if (!deleteUser) {
      return res.status(400).json('Data is not found');
    }

    res.status(200).json({
      DeletedData: deleteUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

