var express = require('express');
var router = express.Router();

// Require controller modules.

var productController = require('../controller/pro.js'); 

//----Purchase---Stock-----Batch ROUTES----//*******************//
router.get('/get', productController.all);
router.get('/:id', productController.byId);
router.post('/update/:id', productController.update);
router.delete('/:id', productController.remove);


module.exports = router;
