const fs = require('fs');
const multer = require('multer');
const UserManagement = require("../models/user_management");
const jwt = require('jsonwebtoken');
var md5 = require('md5');
const secretkey = process.env.SECRETKEY;
const mongoose = require('mongoose');

const { login, create, role, get, edit} = require('../controller/usermanagementController');

describe('userManagement', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      file: { filename: 'example.jpg' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

//   describe('login', () => {
//     it('should log in user with correct credentials and return a JWT token', async () => {
//       const user = {
//         _id: '1',
//         user_id: '1',
//         role: 'admin',
//         firstName: 'John',
//         lastName: 'Doe',
//         phone_no: '1234567890',
//         email: 'john.doe@example.com',
//         address: '123 Main St',
//         city: 'New York',
//         pincode: '10001',
//         joined_date: '2022-01-01',
//         shift_time: '9:00-17:00',
//         tenure: '2 years',
//       };
//       jest.spyOn(UserManagement, 'findOne').mockResolvedValue(user);
//       const signSpy = jest.spyOn(jwt, 'sign');
//       const token = 'jwt-token';
//       signSpy.mockImplementation((payload, secretOrPrivateKey, options, callback) => {
    //     callback(null, token);
    //   });

    //   req.body.phone_no = '1234567890';
    //   req.body.password = 'password';

    //   await login(req, res);

    //   expect(UserManagement.findOne).toHaveBeenCalledWith({
    //     phone_no: '1234567890',
    //     password: md5('password'),
    //   });
    //   expect(signSpy).toHaveBeenCalledWith(
    //     { newUser: user },
    //     secretkey,
    //     { expiresIn: '24h' },
    //     expect.any(Function)
    //   );
    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.json).toHaveBeenCalledWith({
    //     status: '200',
    //     message: 'Successfully LogedIn',
    //     data: {
    //       _id: '1',
    //       user_id: '1',
    //       role: 'admin',
    //       firstName: 'John',
    //       lastName: 'Doe',
    //       phone_no: '1234567890',
    //       email: 'john.doe@example.com',
    //       address: '123 Main St',
    //       city: 'New York',
    //       pincode: '10001',
    //       joined_date: '2022-01-01',
    //       shift_time: '9:00-17:00',
    //       tenure: '2 years',
    //       user_image: '65.0.129.68/api/v1/user_management/profilePicture/example.jpg',
    //       token,
    //     },
    //   });
    // });

    it('should return an error message if user is not found', async () => {
      jest.spyOn(UserManagement, 'findOne').mockResolvedValue(null);

      req.body.phone_no = '1234567890';
      req.body.password = 'password';

      await login(req, res);

      expect(UserManagement.findOne).toHaveBeenCalledWith({
        phone_no: '1234567890',
        password: md5('password'),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: '200',
        message: 'no record found',
      });
    });
});
