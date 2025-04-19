const saleorders = require("../models/sales");
const helper = require('../helper/Graphhelper');
const utils = require('../utils');
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
exports.getdata = async(req, res) => {
    const orderList = await saleorders.find({});
    res.json({ "status": 200, "msg": 'data has been fetched', res: orderList });
}
// admin bar graph #################################################
exports.getWeeklyData = async(req, res) => {
    try {
        //const startDate = moment(req.query.startDate, "DD-MM-YYYY").toISOString();
        const startDate = new Date(req.query.startDate).toISOString();
        console.log(startDate);
        // const endDate = moment(req.query.endDate, "DD-MM-YYYY").toISOString();
        const endDate = new Date(req.query.endDate).toISOString();
        console.log(endDate);
        let data = await saleorders.aggregate([{
                $match: {
                    currentDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: '$currentDate',
                    weight: {
                        $sum: '$dpTotalWeight'
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            { $sort: { _id: 1 } },
        ]);
        console.log("############", data);
        const groupData = {
            startDate: startDate,
            endDate: endDate,
            timezone: 'Asia/Kolkata',
        }
        const groupBy = helper.getGroupByParameter(groupData);
        for (let index = 0; index < data.length; index++) {
            let session = data[index];
            session.time = session._id
            session = helper.appendDateFields(groupBy, session);
            const isLastRecord = index === data.length - 1 ? true : false;
            session.xAxisLabel = utils.fetchXaxisLabel(
                session.time,
                groupData.timezone,
                groupBy,
                groupData.startDate,
                groupData.endDate,
                isLastRecord,
            );
        }
        if (!data || !data.length) {
            data = await helper.appendZero(groupData, groupBy);
        }
        console.log(data);
        res.json({ "status": 200, "msg": 'data has been fetched', res: data });
    } catch (error) {
        res.json({
            "status": 400,
            "msg": 'data not fetch'
        })
    }
}
// bar garph for salesmanger ###### get by sales_id #################..........
exports.getAlldata = async(req, res) => {
    try {
        // const startDate = moment(req.query.startDate, "DD-MM-YYYY").toISOString();
        // console.log(startDate);
        // const endDate = moment(req.query.endDate, "DD-MM-YYYY").toISOString();
        const startDate = new Date(req.query.startDate).toISOString();
        console.log(startDate);
        const endDate = new Date(req.query.endDate).toISOString();
        let data = await saleorders.aggregate([{
                $match: {
                    "sales_id": String(req.query.sales_id),
                    // sales_id: {
                    //     $in: [(req.query.sales_id)]
                    // },
                    currentDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: '$currentDate',
                    weight: {
                        $sum: '$dpTotalWeight'
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            { $sort: { _id: 1 } },
        ]);
        console.log('@@@@@@@@@@', data);
        const groupData = {
            startDate: startDate,
            endDate: endDate,
            timezone: 'Asia/Kolkata',
        }
        const groupBy = helper.getGroupByParameter(groupData);
        for (let index = 0; index < data.length; index++) {
            let session = data[index];
            session.time = session._id
            session = helper.appendDateFields(groupBy, session);
            const isLastRecord = index === data.length - 1 ? true : false;
            session.xAxisLabel = utils.fetchXaxisLabel(
                session.time,
                groupData.timezone,
                groupBy,
                groupData.startDate,
                groupData.endDate,
                isLastRecord,
            );
        }
        if (!data || !data.length) {
            data = await helper.appendZero(groupData, groupBy);
        }
        res.json({ "status": 200, "msg": 'data has been fetched', res: data });
    } catch (error) {
        res.json({
            "status": 400,
            "msg": 'data not fetch'
        })
    }
}