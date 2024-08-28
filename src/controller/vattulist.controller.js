const VattuList=require('../services/vattulist.services')

const {OK,CREATED,SuccessResponse}  = require("../core/success.response")

class VattuListController {
    getVattuList=async (req,res,next)=>{
        new SuccessResponse({
            message:'Get all vattu list success',
            metadata:await VattuList.getVattuList(req.query)
        }).send(res)

    }

}
module.exports = new VattuListController()