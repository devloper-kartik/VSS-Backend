const SalesModel = require("../models/sales");

exports.getTotal = async(req, res) => {
    const recordByClient = await SalesModel.find({
        'clientName': {
            $in: [(req.query.clientName)]
        }
    });
    const recordBySalesManger = await SalesModel.find({
        'sales_id': {
            $in: [(req.query.sales_id)]
        }
    });

    const recordByProduct = await SalesModel.find({
        'products.select_product': {
            $in: [(req.query.select_product)]
        }
    });
    res.json({
        "status": 200,
        "msg": 'data has been fetched',
        recordBySalesManger: recordBySalesManger,
        recordByClient,
        recordByProduct
    });
}