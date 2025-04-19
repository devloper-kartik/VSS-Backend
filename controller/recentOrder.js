const SalesModel = require("../models/sales");
const Mongoose = require("mongoose");


exports.getrecentOrder = async (req, res) => {
    const recentOrder = await SalesModel.aggregate([
        { $sort: { orderId: 1, currentDate: 1 ,clientName:1, orderstatus:1} },
        {
            "$group":
            {
                "_id":
                    { "orderId": "$orderId" },
                    dateOf_Order: { $last: "$currentDate" },
                    clientName: { $last: "$clientName" },
                    orderstatus: { $last: "$orderstatus" }
                
            }
        }     
    ]);
    res.json({ "status": 200, "msg": 'data has been fetched', recentOrder: recentOrder });
}