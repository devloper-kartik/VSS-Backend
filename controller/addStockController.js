const AddStock = require("../models/addStockSchema");
// import { createClient } from 'redis';
// const redis = require('redis');

// // const client = createClient();
// const client = redis.createClient();

exports.create = async (req, res) => {
  try {
    const {
      item,
      company,
      topColor,
      thickness,
      width,
      length,
      temper,
      coating,
      grade,
      guardFilm,
      batchNumber,
      purchaseNumber,
      Weight,
    } = req.body;

    const existingStock = await AddStock.findOne({
      item,
      company,
      topColor,
      thickness,
      width,
      length,
      temper,
      coating,
      grade,
      guardFilm,
      batchNumber,
      purchaseNumber,
    });

    console.log("existingStock data is", existingStock);

    if (existingStock) {
      existingStock.Weight += Weight;
      await existingStock.save();
      console.log("Stock updated successfully:", existingStock);
      res
        .status(200)
        .json({ message: "Stock updated successfully", stock: existingStock });
    } else {
      // If the stock doesn't exist, create a new one
      const newStock = new AddStock({
        item,
        company,
        length,
        width,
        topColor,
        thickness,
        temper,
        coating,
        grade,
        guardFilm,
        batchNumber,
        purchaseNumber,
        Weight,
      });
      await newStock.save();
      console.log("Stock created successfully:", newStock);
      res
        .status(200)
        .json({ message: "Stock created successfully", stock: newStock });
    }
  } catch (err) {
    console.log("Error creating stock:", err);
    res.status(500).json({ message: err.message });
  }
};

// client.on('error', (err) => {
//     console.error('Redis error:', err);
// });

// client.on('connect', () => {
//     console.log('Connected to Redis server');
// });

//admin also get the stock by this api......
exports.get = async (req, res) => {
  console.log("faching data");
  const stock = await AddStock.findOne({
    purchaseNumber: req.params.purchaseNumber,
  });

  client.SETEX(
    req.params.purchaseNumber,
    60,
    JSON.stringify(stock),
    (err, result) => {
      if (err) {
        console.error("Redis command error:", err);
        res.status(500).json({ error: err.message });
      } else {
        console.log("Redis command result:", result);
        res.json({ result: result });
      }
    }
  );
  // Return the stock object
  res.json({ res: stock });
};

exports.edit = async (req, res) => {
  try {
    const updatedAddStock = await AddStock.findOneAndUpdate({
      purchaseNumber: req.params.purchaseNumber,
    }).exec();
    updatedAddStock.set(req.body);
    var result = await updatedAddStock.save();
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await AddStock.findOneAndDelete({
      purchaseNumber: req.params.purchaseNumber,
    }).deleteOne();
    res.json({ message: "stock has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
