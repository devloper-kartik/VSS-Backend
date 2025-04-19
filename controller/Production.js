var Production_incharge = require('../models/Inventory');


///-------all Data Will BE obtain When ORder is Create by Admin/sales /Production Management

// exports.create = async(req, res) => {
//      qwe = req.body
//     feet = 304.8 //1 feet=304.8mm
//     const user = new Production_incharge({
//         product: qwe.product,
//         company: qwe.company,
//         grade: qwe.grade,
//         topcolor: qwe.topcolor,
//         coating: qwe.coating,
//         temper: qwe.temper,
//         guardfilm: qwe.gauardfilm,
//         thickness: qwe.thickness,
//         width: qwe.width,
//         length: qwe.length,
//         pcs: qwe.pcs,
//         weight: qwe.weight, //Density----> 7.84e-6 = 7.84 x 10-6 = 0.00000784    kg/mm^3
//         approx_weight: qwe.approx_weight,
//         batch_number: 'Batch' + '-' + qwe.thickness + '-' + qwe.product,
//         ready_production: qwe.ready_production,
//         vehical_no: qwe.vehical_no,
//         vendor: qwe.vendor,
//         production_incharge_name: qwe.production_incharge_name,
//         assign_date: qwe.assign_date,
//         thickness_selected: qwe.thickness_selected,
//         width_selected: qwe.width_selected,
//         color_selected: qwe.color_selected,
//         company_name_selected: qwe.company_name_selected,
//         completion_date: qwe.completion_date,
//         batch_assign: qwe.batch_assign,
//         note: qwe.note,
//         density: qwe.density,
//         approx_length_in_batch: ((qwe.weight) / ((qwe.thickness) * (qwe.width) * (qwe.density))), //7.84e-6
//         approx_weight_per_mm: ((qwe.density * (qwe.thickness * qwe.width))),
//         pcs_cut: qwe.pcs_cut,
//         length_per_pcs_cut: qwe.length_per_pcs_cut,
//         approx_weight_cut: (qwe.density) * (qwe.thickness) * (qwe.width) * (qwe.pcs_cut) * (qwe.length_per_pcs_cut),
//         total_length_cut: (qwe.pcs_cut * qwe.length_per_pcs_cut),
//     });

//     try {

//         const Inventor = await user.save();
//         res.status(201).json({ "status": 200, "msg": 'Sucessfully created', Inventor });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };


exports.create = async (req, res) => {
    const qwe = req.body; // Don't forget to declare variables with 'const', 'let', or 'var'.
    const feet = 304.8; // 1 feet = 304.8mm

  const existingStocks = await Production_incharge.findOne({
    product: qwe.product,
    company: qwe.company,
    grade: qwe.grade,
    topcolor: qwe.topcolor,
    coating: qwe.coating,
    temper: qwe.temper,
    guardfilm: qwe.guardfilm, // Fixed typo 'gauardfilm' to 'guardfilm'
    thickness: qwe.thickness,
    width: qwe.width,
    length: qwe.length,
  })

  if(existingStocks){
    existingStocks.weight += qwe.weight;
    await existingStocks.save();
    res.status(200).json({ message: 'Stock updated successfully', stock: existingStocks});
  }
  else{

    const user = new Production_incharge({
        product: qwe.product,
        company: qwe.company,
        grade: qwe.grade,
        topcolor: qwe.topcolor,
        coating: qwe.coating,
        temper: qwe.temper,
        guardfilm: qwe.guardfilm, // Fixed typo 'gauardfilm' to 'guardfilm'
        thickness: qwe.thickness,
        width: qwe.width,
        length: qwe.length,
        pcs: qwe.pcs,
        weight: qwe.weight, // Density----> 7.84e-6 = 7.84 x 10-6 = 0.00000784 kg/mm^3
        approx_weight: qwe.approx_weight,
        batch_number: 'Batch' + '-' + qwe.thickness + '-' + qwe.product,
        ready_production: qwe.ready_production,
        vehical_no: qwe.vehical_no,
        vendor: qwe.vendor,
        production_incharge_name: qwe.production_incharge_name,
        assign_date: qwe.assign_date,
        thickness_selected: qwe.thickness_selected,
        width_selected: qwe.width_selected,
        color_selected: qwe.color_selected,
        company_name_selected: qwe.company_name_selected,
        completion_date: qwe.completion_date,
        batch_assign: qwe.batch_assign,
        note: qwe.note,
        density: qwe.density,
        approx_length_in_batch: (qwe.weight / (qwe.thickness * qwe.width * qwe.density)), // 7.84e-6
        approx_weight_per_mm: qwe.density * (qwe.thickness * qwe.width),
        pcs_cut: qwe.pcs_cut,
        length_per_pcs_cut: qwe.length_per_pcs_cut,
        approx_weight_cut: qwe.density * qwe.thickness * qwe.width * qwe.pcs_cut * qwe.length_per_pcs_cut,
        total_length_cut: qwe.pcs_cut * qwe.length_per_pcs_cut,
    });

}

    try {
        const Inventor = await user.save();
        res.status(201).json({ status: 200, msg: 'Successfully created', Inventor });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



exports.batch_list=async(req,res)=>{
   try{

    const{thickness_selected,width_selected,color_selected}=req.body
    const filterCriteria=[];
    if(thickness_selected){
        filterCriteria.push({thickness:thickness_selected})
    }

    if(width_selected){
        filterCriteria.push({width:width_selected})
    }

    if(color_selected){
        filterCriteria.push({topcolor:color_selected})
    }

    const query={
        $and:filterCriteria
    }

    const list=await Production_incharge.find(query)
    console.log("list data is",list)
    res.json({ "status": 200, "msg": 'data has been fetched',list})
   }
   catch(error){
    res.status(500).json({ message: err.message });
   }
}


//---------------------------------------------------------//

//thikness-width-length-color for filter will be get by order

// exports.batch_list = async(req, res) => {
//     try {


//         //         let thikness_sel = req.body.thickness_selected;
//         //         let width_sel = req.body.width_selected;
//         //         let color_sel = req.body.color_selected;
//         //         let product_sel = req.body.product_selected;
//         //         let company_sel = req.body.company_selected;
//         //         let length_sel = req.body.length_selected;
//         //         let grade_sel = req.body.grade_selected;
//         //         let coating_sel = req.body.coating_selected;
//         //         let temper_sel = req.body.temper_selected;
//         //         let guardfilm_sel = req.body.guardfilm_selected;
//         //         let batch_number_sel = req.body.batch_number_selected;
//         //         let topcolor_sel = req.body.color_selected;



//         //         let dataArray = [];

//         //         if (thikness_sel) {
//         //             dataArray.push({ thickness: { $eq: thikness_sel } });
//         //         }
//         //         if (width_sel) {
//         //             dataArray.push({ width: { $eq: width_sel } });
//         //         }
//         //         if (color_sel) {
//         //             dataArray.push({ width: { $eq: color_sel } });
//         //         }
//         //         if (product_sel) {
//         //             dataArray.push({ width: { $eq: product_sel } });
//         //         }
//         //         if (company_sel) {
//         //             dataArray.push({ width: { $eq: company_sel } });
//         //         }
//         //         if (length_sel) {
//         //             dataArray.push({ width: { $eq: length_sel } });
//         //         }
//         //         if (grade_sel) {
//         //             dataArray.push({ width: { $eq: grade_sel } });
//         //         }
//         //         if (topcolor_sel) {
//         //             dataArray.push({ width: { $eq: topcolor_sel } });
//         //         }
//         //         if (coating_sel) {
//         //             dataArray.push({ width: { $eq: coating_sel } });
//         //         }
//         //         if (temper_sel) {
//         //             dataArray.push({ width: { $eq: temper_sel } });
//         //         }
//         //         if (guardfilm_sel) {
//         //             dataArray.push({ width: { $eq: guardfilm_sel } });
//         //         }
//         //         if (batch_number_sel) {
//         //             dataArray.push({ width: { $eq: batch_number_sel } });
//         //         }
//         //         const List = await Production_incharge.find({
//         //             // $or: [
//         //     { thickness: { $eq: thikness_sel } },
//         //     { width: { $eq: width_sel } },
//         //     { product: { $eq: product_sel } },
//         //     { company: { $eq: company_sel } },
//         //     { length: { $eq: length_sel } },
//         //     { grade: { $eq: grade_sel } },
//         //     { topcolor: { $eq: topcolor_sel } },
//         //     { coating: { $eq: coating_sel } },
//         //     { temper: { $eq: temper_sel } },
//         //     { guardfilm: { $eq: guardfilm_sel } },
//         //     { batch_number: { $eq: batch_number_sel } },
//         //     { topcolor: { $eq: color_sel } },

//         //     {
//         // $and: [
//         //     { dataArray }
//         // ]



//         //         })


//         //         res.json({ "status": 200, "msg": 'data has been fetched', "list-data": List });
//         //     } catch (err) {
//         //         res.status(500).json({ message: err.message })
//         //     }
//         // }

//         let thikness_sel = req.body.thickness_selected;
//         let width_sel = req.body.width_selected;
//         let color_sel = req.body.color_selected;
//         console.log(thikness_sel);

//         const List = await Production_incharge.find({
//             $and: [
//                 { "width": { $eq: width_sel } },
//                 { "thickness": { $eq: thikness_sel } },
//                 { "topcolor": { $eq: color_sel } },

//             ]
//         })
//         console.log("@@@@@@", List);
//         res.json({ "status": 200, "msg": 'data has been fetched', "list-data": List });
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// };



exports.batch_get_all = async(req, res) => {
    try {
        let all = mongoose.Schema.Type.ObjectId(req.params.batch_number);
        const List = await Production_incharge.find({ 
            all 
        }, { _id: 1, weight: 1, used: 1, remaning: 1 })

        res.json({ "status": 200, "msg": 'data has been fetched', "list-data": List });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
};




//arrange  (batch) roll by weight in  assending order
//To specify sorting order 1 and -1 *are used.
// 1 is used for ascending order while -1 is used for descending order.



// exports.batch_getbyweight = async(req, res) => {
//     try {
//         let thikness_sel = req.body.thickness_selected;
//         let width_sel = req.body.width_selected;
//         let color_sel = req.body.color_selected;
//         let company_sel = req.body.company_selected;

//         const List = await Production_incharge.find({

//             $and: [ 
//                 { width: { $eq: width_sel } },
//                 { thickness: { $eq: thikness_sel } },
//                 { topcolor: { $eq: color_sel } }
//             ]
//         }).sort({ weight: 1 })

//         res.json({ "status": 200, "msg": 'data has been fetched', "list-data": List });
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// }



exports.batch_getbyweight = async (req, res) => {
    try {
        const { thickness_selected, width_selected, color_selected } = req.body;
        const filterCriteria = [];

        if (thickness_selected) {
            filterCriteria.push({ thickness: thickness_selected });
        }

        if (width_selected) {
            filterCriteria.push({ width: width_selected });
        }

        if (color_selected) {
            filterCriteria.push({ topcolor: color_selected }); // Corrected field name to 'topcolor'
        }

        const matchStage = {
            $match: {
                $and: filterCriteria,
            },
        };

        const sortStage = {
            $sort: { weight: 1 }, // Sort by 'weight' in descending order
        };

        const pipeline = [matchStage, sortStage];

        const list = await Production_incharge.aggregate(pipeline);

        console.log("list data is", list);
        res.json({ "status": 200, "msg": 'data has been fetched', data: list });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}





exports.batch_sort_by_weight_all_batch = async(req, res) => {
    try {


        const List = await Production_incharge.find({}).sort({ weight: 1 })

        res.json({ "status": 200, "msg": 'data has been fetched', "list-data": List });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.edit = async(req, res) => {
    try {
        const updatedUser = await Production_incharge.findById(req.params.batch_number).exec();

        updatedUser.set(req.body);
        const updateSalesorder = await updatedUser.save();
        res.status(201).json({ "status": 200, "msg": 'record sucessfully updated', res: updateSalesorder });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

}

// DElete by ID
exports.delete = async(req, res) => {
    try {
        await Production_incharge.findOneAndDelete(req.params.id).deleteOne();
        res.json({ message: "ENTRY has been deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//pagination----->get------------>all----->with--------->pagination 

//pagination 

exports.allRecords = async(req, res, next) => {

    const page = parseInt(req.query.page);

    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;

    const endIndex = page * limit;

    const total_pages = await Production_incharge.countDocuments().exec()

    const result = {};

    if (endIndex < (await Production_incharge.countDocuments().exec())) {

        result.next = {

            page: page + 1,

            limit: limit,

            total_pages: Math.round(total_pages / limit)

        };

    }

    if (startIndex > 0) {

        result.previous = {

            page: page - 1,

            limit: limit,

            total_pages: Math.round(total_pages / limit)
        };
    }
    try {
        result.results = await Production_incharge.find().limit(limit).skip(startIndex);
        res.paginatedResult = result;
        res.status(201).json({ "status": 200, "msg": 'records get', "output": res.paginatedResult });
        next();
    } catch (e) {
        res.status(500).json({ message: e.message });

    }
}




//--------------------> get  by ID

exports.getbyid = async(req, res) => {
    const StockList = await stock.findById(req.params.id);
    res.json({ "status": 200, "msg": 'data has been fetched', res: StockList });
}


exports.get = async(req, res) => {
    const StockList = await Production_incharge.findById(req.params.id);
    res.json({ "status": 200, "msg": 'data has been fetched', res: StockList });
}






//-----------------------**------------------**----------------------**----------------


exports.filter_in_stock = async (req, res) => {
    try {
        const {
            thickness_selected,
            width_selected,
            color_selected,
            product_selected,
            company_selected,
            length_selected,
            grade_selected,
            coating_selected,
            temper_selected,
            guardfilm_selected,
            batch_number_selected,
            topcolor_selected
        } = req.body;

        // Create an array to store filter criteria
        const filterCriteria = [];

        if (thickness_selected) {
            filterCriteria.push({ thickness: thickness_selected });
        }
        if (width_selected) {
            filterCriteria.push({ width: width_selected });
        }
        if (color_selected) {
            filterCriteria.push({ topcolor: color_selected });
        }
        if (product_selected) {
            filterCriteria.push({ product: product_selected });
        }
        if (company_selected) {
            filterCriteria.push({ company: company_selected });
        }
        if (length_selected) {
            filterCriteria.push({ length: length_selected });
        }
        if (grade_selected) {
            filterCriteria.push({ grade: grade_selected });
        }
        if (coating_selected) {
            filterCriteria.push({ coating: coating_selected });
        }
        if (temper_selected) {
            filterCriteria.push({ temper: temper_selected });
        }
        if (guardfilm_selected) {
            filterCriteria.push({ guardfilm: guardfilm_selected });
        }
        if (batch_number_selected) {
            filterCriteria.push({ batch_number: batch_number_selected });
        }
        if (topcolor_selected) {
            filterCriteria.push({ topcolor: topcolor_selected });
        }

        // Use the $and operator to combine the filter criteria
        const query = {
            $and: filterCriteria,
        };

        // Use the query to find matching records in the database
        const List = await Production_incharge.find(query);

        res.json({ "status": 200, "msg": 'data has been fetched', "list-data": List });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
