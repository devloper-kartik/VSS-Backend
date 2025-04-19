const mongoose = require('mongoose');

const userImgSchema = new mongoose.Schema({

    userPictures: [{ img: { type: String } }],
});

module.exports = mongoose.model('userImage', userImgSchema);