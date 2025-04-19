const OrderNotice = require("../models/OrderNoticeSchema");

exports.create = async (req, res) => {
  const user = new OrderNotice({
    company: req.body.company,
    remark: req.body.remark,
  });

  try {
    const newUser = await user.save();
    res.status(200).json({ newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get
exports.get = async (req, res) => {
  const _List = await OrderNotice.find(req.params.id);
  res.json({ status: 200, msg: "data has been fetched", res: _List });
};
