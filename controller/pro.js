var Production_incharge= require('../models/Inventory');
const productController = {
    all (req, res) {
       const list= Production_incharge.find({})
            .exec((err, products) => res.json(products))
    },
    byId (req, res) {
        const idParam = req.params.id;
        const list=   Production_incharge
            .findOne({_id: idParam})
            .exec( (err, product) => res.json(product) );
    },
    update (req, res) {

        const idParam = req.params.id;
        let product = req.body;
            const list =  Production_incharge.findOne({_id: idParam},req.body,(err, data) => {
            data.pcs_cut = product.pcs_cut;
            data.length_per_pcs_cut=product.length_per_pcs_cut;
            data.total_length_cut=(product.pcs_cut*product.length_per_pcs_cut);
            data.approx_weight_cut=(product.pcs_cut*product.length_per_pcs_cut)*(product.approx_weight_per_mm);
            data.save((err, updated) => res.json(updated));
        })
      
    },
    
     remove (req, res) {
        const idParam = req.params.id;
        const list= Production_incharge.findOne({_id: idParam}).remove( (err, removed) => res.json(idParam) )
    }
    
};



module.exports = productController;


