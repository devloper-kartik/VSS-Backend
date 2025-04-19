const sales = require("../models/sales");
const salesorder = require("../models/sales");
var ISODate = require('isodate');
const moment = require('moment')


//Records by Production Incharge and Date filter
exports.getTotalDelivary = async (req, res) => {
   const proid=req.body.pIn_id;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total_doc= await salesorder.countDocuments().exec()
  const result = {};
  if (endIndex < (await salesorder.countDocuments().exec())) {
                result.next = {
                  page: page + 1,
                  limit: limit,
                  total_doc:Math.round (total_doc/limit)
                };
  }
  if (startIndex > 0) {
                result.previous = {
                  page: page - 1,
                  limit: limit,
                  total_doc:Math.round (total_doc/limit)
                };
  }
       const current_date=new Date().toISOString();
        console.log(current_date);

        const last_date=new Date();
        const endDate =new Date(last_date.setHours(23,00,00)).toISOString();
        console.log(endDate);

  try { 
        
        const productiondata = await salesorder.find({$and: [{'products' : {"$elemMatch" : { 'pIn_id':proid}} },
         {currentDate:{
          $gte: current_date,
          $lte: endDate} 
          }
        ]}).sort({_id:-1}).limit(limit).skip(startIndex);
         res.status(201).json({ "status": 200, "msg": 'records get', "output":productiondata});
  
  }catch(err){
     console.log(err);
      res.status(400).json({ message: err.message });
  }
}