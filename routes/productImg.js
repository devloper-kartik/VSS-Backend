const express = require('express');
const path = require('path');
const multer = require('multer');
const { nanoid } = require('nanoid');
const productcontroller = require('../controller/productImgcontroller');
const router = express.Router();


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function(req, file, cb) {
        cb(null, nanoid() + '-' + file.originalname);
    },
});

const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    filefilter: filefilter
});

router.use('/productPicture', express.static('uploads'));

router.post(
    '/products/create',
    upload.array('productPicture'), // for storing single image : upload.single('productPicture')
    productcontroller.createProduct
);

router.get('/get', productcontroller.get);

//////user..................############...user......................


router.use('/userPicture', express.static('uploads'));

router.post(
    '/user/create',
    upload.array('userPicture'),
    productcontroller.userImage
);

router.get('/get/user', productcontroller.getuser);


module.exports = router;