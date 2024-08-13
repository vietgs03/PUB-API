const PackingListService = require('../services/packinglist.services')
const {OK,CREATED,SuccessResponse}  = require("../core/success.response")

class PackingListController {

    getAllPackingList = async (req,res,next) => {
        new SuccessResponse({
            message:'Get all packing list success',
            metadata:await PackingListService.getPackingListImport(req.query)
        }).send(res)
    }
}

module.exports = new PackingListController()