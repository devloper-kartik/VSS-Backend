const Adminlogin = require("../models/admin");
const session = require('express-session');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const secretkey = process.env.SECRETKEY;


// exports.auth = async (req, res) => {
//   try {
//     const newUser = await Adminlogin.findOne({ username: req.body.username, password: md5(req.body.password), role: req.body.role });

//     if (newUser) {
//       newUser.status = true; // Update the status value directly
//       const updatedUser = await newUser.save();

//       jwt.sign({ newUser }, secretkey, { expiresIn: '3s' }, (err, token) => {
//         res.status(200).json({
//           status: true,
//           data: { _id: newUser._id, username: newUser.username, token },
//           updatedSalesOrder: updatedUser
//         });
//       });
//     } else {
//       res.status(200).json({ message: "No record found" });
//     }
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// exports.auth = async (req, res) => {
//   try {
//     const newUser = await Adminlogin.findOne({ username: req.body.username, password: md5(req.body.password), role: req.body.role });

//     if (newUser) {
//       newUser.status = true; // Update the status value directly
//       const updatedUser = await newUser.save();

//       jwt.sign({ newUser }, secretkey, { expiresIn: '3s' }, (err, token) => {
//         if (err) {
//           res.status(500).json({ message: 'Token generation error' });
//         } else {
//           // Expire the old token by setting the expiration to 0 seconds
//           const expiredToken = jwt.sign({ newUser }, secretkey, { expiresIn: 0 });

//           res.status(200).json({
//             status: true,
//             data: { _id: newUser._id, username: newUser.username, token, expiredToken },
//             updatedSalesOrder: updatedUser
//           });
//         }
//       });
//     } else {
//       res.status(200).json({ message: "No record found" });
//     }
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };


exports.auth = async (req, res) => {
  try {
    const newUser = await Adminlogin.findOne({
      username: req.body.username,
      password: md5(req.body.password)
      // role: req.body.role
    });

    if (newUser) {
      newUser.status = true; // Update the status value directly
      const updatedUser = await newUser.save();

      jwt.sign({ newUser }, 'secretkey', { expiresIn: '24h' }, (err, token) => {
        if (err) {
          res.status(500).json({ message: 'Token generation error' });
        } else {
          // Decode the token to get the payload
          const decoded = jwt.decode(token);

          // Set the expiration time to a past date
          const pastExpiration = Math.floor(Date.now() / 1000) - 3;

          // Update the payload with the new expiration time
          decoded.exp = pastExpiration;

          // Generate the expired token
          const expiredToken = jwt.sign(decoded, secretkey);

          res.status(200).json({
            status: true,
            data: { _id: newUser._id, username: newUser.username, token, expiredToken },
            updatedSalesOrder: updatedUser
          });
        }
      });
    } else {
      res.status(200).json({ message: "No record found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// Create a new user
exports.createUser = async (req, res) => {
  try {
    // const { username, password, status, role } = req.body;
    const { username, password } = req.body;

    // Create a new user
    const newUser = new Adminlogin({
      username: username,
      password: md5(password), // Hash the password
      // status: status,
      // role: role

    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(200).json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.changeStatus = async (req, res) => {
  try {
    const updatedUser = await Adminlogin.findOne();
    if (updatedUser) {
      updatedUser.status = false; // Change the status value directly
      const updatedSalesOrder = await updatedUser.save();
      res.status(200).json({ msg: "Status changed", updatedSalesOrder });
    } else {
      res.status(200).json({ message: "No user found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const adminStatus = await Adminlogin.findOne();
    if (adminStatus) {
      res.status(200).json({ message: "Admin status", loginStatus: adminStatus.status });
    } else {
      res.status(200).json({ message: "No user found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.manualchanges = async (req, res) => {
  try {
    const updatedUser = await Adminlogin.findOne();
    if (updatedUser) {
      updatedUser.set(req.body); // Update the document with the request body data
      const updateSalesOrder = await updatedUser.save(); // Save the updated document

      setInterval(() => {
        updatedUser.status = false; // Change the status value directly on the updatedUser object
        updatedUser.save(); // Save the updated document
      }, 43200000); // The interval is set to 12 hours (43200000 milliseconds)

      res.status(200).json({ msg: "Status change", updateSalesOrder });
    } else {
      res.status(200).json({ message: "No user found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the request parameters

    // Find the user by ID and remove it
    const deletedUser = await Adminlogin.findOneAndDelete(userId);

    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// // Logout API
// exports.logout = async (req, res) => {
//   try {
//     // Clear the user's session or token
//     // If you are using express-session
//     req.session.destroy();

//     // If you are using JWT tokens
//     // You can blacklist the token or simply remove it from the client-side storage

//     res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// // Logout API
// exports.logout = (req, res) => {
//   try {
//     // Get the token from the request headers
//     const token = req.headers.authorization.split(' ')[1];

//     // Verify and decode the token
//     const decoded = jwt.verify(token, secretkey);

//     // Create a new token without the expiresIn option
//     const expiredToken = jwt.sign(decoded, secretkey);

//     // Send the new token with the response
//     res.status(200).json({ message: 'Logout successful', token: expiredToken });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.logout = (req, res) => {
//   try {
//     // Get the token from the request headers
//     const token = req.headers.authorization.split(' ')[1];

//     // Verify and decode the token
//     const decoded = jwt.verify(token, secretkey);

//     // Create a new token without the expiresIn option
//     const expiredToken = jwt.sign(decoded, secretkey);

//     // Send the new token with the response
//     res.status(200).json({ message: 'Logout successful', token: expiredToken });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.logout = (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(' ')[1];

    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, secretkey);

      // Create a new token without the expiresIn option
      const expiredToken = jwt.sign(decoded, secretkey);

      // Send the new token with the response
      res.status(200).json({ message: 'Logout successful', token: expiredToken });
    } catch (err) {
      // Handle TokenExpiredError
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Token expired' });
      } else {
        throw err; // Let other errors bubble up for generic error handling
      }
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// exports.logout = async (req, res) => {
//   try {
//     const existingUser = await Adminlogin.findOne({ username: req.body.username });

//     if (existingUser && existingUser.status) {
//       const updatedUser = await Adminlogin.findOneAndUpdate(
//         { username: req.body.username },
//         { status: false },
//         { new: true }
//       );

//       if (updatedUser) {
//         res.status(200).json({ message: "Logout successful" });
//       } else {
//         res.status(200).json({ message: "No record found" });
//       }
//     } else {
//       res.status(200).json({ message: "User is already logged out" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


