const saleorders = require("../models/sales");
const stock = require("../models/Stock_M");
const salesreadymade = require("../models/salesreadymade");
const helper = require('../helper/Graphhelper');
const utils = require('../utils')
const Mongoose = require("mongoose");
const moment = require('moment');

moment.suppressDeprecationWarnings = true;
// pei_chart for the salesManager######Indiviual get by sales_id #################
exports.getSoldProduct = async(req, res) => {
        try {
            // const startDate = moment(req.query.startDate, "DD-MM-YYYY").toISOString();
            // const endDate = moment(req.query.endDate, "DD-MM-YYYY").toISOString();
            const startDate = new Date(req.query.startDate).toISOString();
            const endDate = new Date(req.query.endDate).toISOString();
            let soldProductbyManger = await saleorders.aggregate([
                { $unwind: "$products" },
                {
                    $match: {
                        "sales_id": String(req.query.sales_id),
                        currentDate: {
                            $gte: startDate,
                            $lte: endDate,
                        }
                    }
                },
                {
                    $group: {
                        _id: "$products.select_product",
                        count: { $sum: 1 }
                    }
                }
            ]);
            ///////////////////////####################################################
            let soldProduct = await saleorders.aggregate([
                { $unwind: "$products" },
                {
                    $match: {
                        currentDate: {
                            $gte: startDate,
                            $lte: endDate,
                        }
                    }
                },
                {
                    $group: {
                        _id: "$products.select_product",
                        count: { $sum: 1 }
                    }
                }
            ]);
            res.json({ "status": 200, "msg": 'data has been fetched', soldProductbyManger: soldProductbyManger, soldProduct });
        } catch (error) {
            res.json({
                "status": 400,
                "msg": 'data not fetch'
            })
        }
    }
    // admin/ peichart / get all sold each product and available#########################
exports.getAllSoldProduct = async(req, res) => {
        try {
            // const startDate = moment(req.query.startDate, "DD-MM-YYYY").toISOString();
            // const endDate = moment(req.query.endDate, "DD-MM-YYYY").toISOString();
            const startDate = new Date(req.query.startDate).toISOString();
            const endDate = new Date(req.query.endDate).toISOString();
            let soldProduct = await saleorders.aggregate([
                { $unwind: "$products" },
                {
                    $match: {
                        currentDate: {
                            $gte: startDate,
                            $lte: endDate,
                        }
                    }
                },
                {
                    $group: {
                        _id: "$products.select_product",
                        count: { $sum: 1 }
                    }
                }

            ]);
            let availableProduct = await stock.aggregate([{
                $group: {
                    _id: '$select_product',
                    count: { $sum: 1 }
                }
            }]);
            res.json({ "status": 200, "msg": 'data has been fetched', soldProduct: soldProduct, availableProduct });
        } catch (error) {
            res.json({
                "status": 400,
                "msg": 'data not fetch'
            })
        }
    }
    // total ready made product############............................
exports.getTotalReadymade = async(req, res) => {
    const readyProduct = await salesreadymade.aggregate([{
        "$group": {
            "_id": { "select_product": "$select_product" },
            "count": { "$sum": 1 },
        }
    }, ]);
    res.json({ "status": 200, "msg": 'data has been fetched', readyProduct: readyProduct });
}