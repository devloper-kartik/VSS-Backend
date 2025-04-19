const { Mongoose } = require("mongoose");
const saleorders = require("../models/sales");
const UserManagement = require("../models/user_management");
require('isodate');
require('moment');

// total sales...purchase...orders...clients...users### for the sales manager  by sales_id#####
exports.getTotal = async(req, res) => {
    try {
        const totalsales = await saleorders.aggregate([{
                    $match: {
                        'sales_id': {
                            $in: [(req.query.sales_id)]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        sales: {
                            $sum: '$orderId'
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ])
            // let name = req.params.sales_id;
            // console.log(name);
            // const clients = await saleorders.distinct("clientName", { name }).count();
            // console.log("222222222222", clients);
        const clients = await saleorders.aggregate([{
                $match: {
                    'sales_id': {
                        $in: [(req.query.sales_id)]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    client: { $addToSet: "$clientName" },
                    // count: {
                    //     $sum: 1
                    // }
                }
            },
        ])
        const data = clients[clients.length - 1];
        const niki = data.client;
        const totalClients = niki.length;
        //////////////////////////////////
        let pendingOrder = await saleorders.aggregate([{
                $match: {
                    "orderstatus": 0,
                    'sales_id': {
                        $in: [(req.query.sales_id)]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])
        res.json({
            "status": 200,
            "msg": 'data has been fetched',
            totalsales: totalsales,
            pendingOrder,
            totalClients,
            // clients
        });
    } catch (error) {
        console.log(error);
        res.json({
            "status": 201,
            "msg": 'No Records Found'
        })
    }
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@for the admin total @@@@@@@@@@@@@@@@@@@@@@
exports.getTotalAdmin = async(req, res) => {
    const weekly=7;
    const monthly=30;
    const yearly=365;
    try {
        const totalsales = await saleorders.aggregate([{
                $group: {
                    _id: null,
                    sales: {
                        $sum: '$orderId'
                    },
                    count: {
                        $sum: 1
                    }
                }
            }]);
        const data1 = totalsales[totalsales.length - 1];
        const sales = data1.count;
        console.log(sales);
        const SalesAverage_weekly= Math.round(sales/weekly);
        const SalesAverage_monthly=Math.round(sales/monthly);
        const SalesAverage_yearly=Math.round(sales/yearly);
        // let totalclients = await saleorders.distinct("clientName").count();
        const clients = await saleorders.aggregate([{
                $group: {
                    _id: null,
                    client: { $addToSet: "$clientName" },
                }
            },
        ])
        const data = clients[clients.length - 1];
        const niki = data.client;
        const totalClients = niki.length;
        let pendingOrder = await saleorders.aggregate([{
                $match: {
                    "orderstatus": 0
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])

        const total_user = await UserManagement.aggregate([{
            $group: {
                _id: null,
                count: {
                    $sum: 1
                }
            }
        }]);
       
        res.json({
            "status": 200,
            "msg": 'data has been fetched',
            totalsales: totalsales,
            totalClients,
            pendingOrder,
            SalesAverage_weekly,
            SalesAverage_monthly,
            SalesAverage_yearly,
            totalusers:total_user
        });
    } catch (error) {
        res.json({
            "status": 400,
            "msg": 'data not fetch'
        })
    }
}

exports.getTotalDelivary=async(req,res)=>{
        const start_date=new Date();
        const current_date=new Date(start_date.setHours(0,0,0)).toISOString();
        console.log(current_date);

         const last_date=new Date();
         const endDate =new Date(last_date.setHours(23,0,0)).toISOString();
         console.log(endDate);

    try {
        const TotalDelivary = await saleorders.aggregate([{
            $match: {
                "currentDate":
                {
                    $gte: current_date,
                    $lte: endDate
                },
                "orderstatus": 3
                
            }
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
       ]);
      
       res.json({
        "status": 200,
        "msg": 'data has been fetched',
        TotalDelivary
    });
        
    } catch (error) {
        res.json({
            "status": 400,
            "msg": 'data not fetch'
        })
    }

}