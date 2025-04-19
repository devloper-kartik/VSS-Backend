const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    productPictures: [{ img: { type: String } }],
});

module.exports = mongoose.model('ProductImage', productSchema);