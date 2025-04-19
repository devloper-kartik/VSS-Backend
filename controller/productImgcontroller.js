const Product = require('../models/productImg');
const User = require('../models/userImg');
const path = require('path');

exports.createProduct = (req, res) => {

    let productPictures = [];

    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return {
                img: `http://13.126.107.114/api/v1/${file.filename}`

            };
        });
    }

    const product = new Product({
        productPictures,
    });

    product.save((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
            res.json({
                success: 1,
                res: product
            })
        }
    });
};

exports.get = async(req, res) => {
    const product_url = await Product.find({});
    res.json({ "status": 200, "msg": 'data has been fetched', res: product_url });
}

//////user.................................


exports.userImage = (req, res) => {

    let userPictures = [];

    if (req.files.length > 0) {
        userPictures = req.files.map((file) => {
            return {
                img: `http://13.126.107.114/api/v1/${file.filename}`

            };
        });
    }

    const user_img = new User({
        userPictures,
    });

    user_img.save((error, user_img) => {
        if (error) return res.status(400).json({ error });
        if (user_img) {
            res.json({
                success: 1,
                res: user_img
            })
        }
    });
};

exports.getuser = async(req, res) => {
    const user_url = await User.find({});
    res.json({ "status": 200, "msg": 'data has been fetched', res: user_url });
}