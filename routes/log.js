var express = require('express');
//const { CommandCursor } = require('mongodb');
var router = express.Router();

// Require controller modules.

var controller_batch = require('../controller/Production'); 

//----Purchase---Stock-----Batch ROUTES----//
router.post('/B/create', controller_batch.create);
    router.post('/B/byweight', controller_batch.batch_getbyweight);

    
    router.post('/B/FilterStock', controller_batch.filter_in_stock);

    router.post('/B/filter', controller_batch.batch_list);
    router.post('/B/allbysort', controller_batch.batch_sort_by_weight_all_batch );
router.get('/B/allbyfilter', controller_batch.batch_get_all);
    router.get('/B/all',controller_batch.allRecords);
    router.get('/B/get/:id',controller_batch.get);
router.post('/B/update/:id', controller_batch.edit);
    router.delete('/:id', controller_batch.delete);



module.exports = router;
