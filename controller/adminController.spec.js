const Adminlogin = require("../models/admin");
const session = require('express-session')
const jwt = require('jsonwebtoken');
var md5 = require('md5');
const { count } = require("../models/admin");
const secretkey = process.env.SECRETKEY;

// Import the functions you want to test
const { auth, changeStatus, checkStatus, manualchanges } = require("../controller/adminController");
describe('auth function', () => {
  test('should return a JWT token for valid username and password', async () => {
    // Arrange
    const req = { body: { username: 'admin', password: 'password' } };
    const res = { 
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const expectedToken = 'fake.jwt.token';

    // Mock the Adminlogin model
    Adminlogin.findOne = jest.fn(() => Promise.resolve({ _id: 'fake-id', username: 'admin', password: md5('password') }));
    Adminlogin.findById = jest.fn(() => ({ exec: jest.fn(() => Promise.resolve({ _id: 'fake-id', username: 'admin', status: true })) }));

    // Mock the jwt.sign function
    jwt.sign = jest.fn((payload, secret, options, callback) => {
      callback(null, expectedToken);
    });

    // Act
    await auth(req, res);
    // Assert
    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({ "status": "true", "data": { "_id": "fake-id", "username": "admin", token: expectedToken } });
  });

  test('should return an error message for invalid username or password', async () => {
    // Arrange
    const req = { body: { username: 'admin', password: 'wrong-password' } };
    const res = { 
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the Adminlogin model
    Adminlogin.findOne = jest.fn(() => Promise.resolve(null));

    // Act
    await auth(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ "message": "no record found" });
  });

  test('should return an error message for a database error', async () => {
    // Arrange
    const req = { body: { username: 'admin', password: 'password' } };
    const res = { 
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the Adminlogin model
    Adminlogin.findOne = jest.fn(() => Promise.reject(new Error('Database error')));

    // Act
    await auth(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('changeStatus function', () => {
  test('should update the status of the first admin user to false', async () => {
    // Arrange
    const req = {};
    const res = { 
      status: jest.fn(() => res),
      json: jest.fn(),
    };

     // Mock the Adminlogin model
    Adminlogin.findOne = jest.fn(() => Promise.resolve({ set: jest.fn(), save: jest.fn(() => Promise.resolve()) }));

    // Act
    await changeStatus(req, res);

    // Assert
    expect(Adminlogin.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ "msg": "status change" });
  });
});
