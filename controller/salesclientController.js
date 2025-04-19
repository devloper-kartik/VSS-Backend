const clientinfo = require("../models/salesclient");


// exports.find =async(req,res)=>{
//     const userList = await clientinfo.findBy(req.params.id);
//     res.json({ res: userList });

// }

exports.create = async (req, res) => {
    try {
        // Check if a client with the same firmName already exists
        const existingClient = await clientinfo.findOne({ firmName: req.body.firmName });

        if (existingClient) {
            // If a client with the same firmName exists, respond with a 409 (Conflict) status code
            res.status(409).json({ status: 500, message: 'This firm name is already registered', data: existingClient });
        } else {
            // If the firmName is not found, create a new client
            const user = new clientinfo({
                clientName: req.body.clientName,
                firmName: req.body.firmName,
                address: req.body.address,
                city: req.body.city,
                phone_no: req.body.phone_no
            });

            const newUser = await user.save();
            res.status(201).json({ status: 201, message: 'Data successfully inserted', data: newUser });
        }
    } catch (err) {
        res.status(400).json({ status: 400, message: err.message });
    }
}




// get
exports.get = async (req, res) => {
    // Rest of the code will go here
    const userList = await clientinfo.findById(req.params.id);
    res.json({"status": 200, "msg": 'data has been fetched', res: userList });
}



// put one
exports.edit = async (req, res) => {
    try {
        const updatedUser = await clientinfo.findById(req.params.id).exec();
        updatedUser.set(req.body);
        var result = await updatedUser.save();
        res.status(201).json({ "status": 200, "msg": 'record sucessfully updated',res: userList });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// delete
exports.delete = async (req, res) => {
    try {
        await clientinfo.findById(req.params.id).deleteOne();
        res.json({ message: "User has been deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//pagination 
exports.allRecords = async (req, res) => {
    // Rest of the code will go here
    try {
        const resPerPage = 10; // results per page
        const page = req.params.page || 1; // Page 
        const userList = await clientinfo.find({}).skip((resPerPage * page) - resPerPage).limit(resPerPage);

        res.json({ userList })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
