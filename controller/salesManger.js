const SalesModel = require("../models/sales");
const stock = require("../models/Stock_M");
const salesreadymade = require("../models/salesreadymade");


exports.getSalesManger = async (req, res) => {
    const sales = await SalesModel.aggregate([
        { $unwind: "$products" },
    
        {
            $group:
            {
                _id: null,
                "Total Sales rate": { $sum: "$products.rate" },
                "countSales": { $sum: 1 }
            }
        }
    ]);



//    exports.availableProduct = await stock.aggregate([
//         {
//             "$group":
//             {
//                 "_id":
//                     { "product": "$product" },
//                 "count":
//                     { "$sum": 1 },
//             }
//         },
//     ]);

    

    const soldProduct = await SalesModel.aggregate([
        { $unwind: "$products" },
        {
            $group:
            {
                _id: '$products.select_product',
                count: { $sum: 1 }
            }
        }
    ]);
    const readyProduct = await salesreadymade.aggregate([
        {
            "$group":
            {
                "_id":
                    { "select_product": "$select_product" },
                "count":
                    { "$sum": 1 },
            }
        }
    ]);
    res.json({
        "status": 200, "msg": 'data has been fetched',
        sales: sales, availableProduct, soldProduct, readyProduct
    });

};


exports.availableProduct = async (req, res) => {
    try {
      const TotalWeight = await stock.aggregate([
        {
          $group: {
            _id: null,
            TotalWeight: { $sum: "$weight" } // Sum the weight field directly
          }
        }
      ]);
  
      res.status(200).json({
        totalweight: TotalWeight[0].TotalWeight // Extract the total weight from the aggregation result
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };
  
