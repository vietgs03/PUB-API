const PackingListService =require('../services/packinglist.services')
const PackingName=require('../services/packinglistname.services')
const PackingColor=require('../services/packinglistcolor.services')

const {OK,CREATED,SuccessResponse}  = require("../core/success.response")

class PackingListController {

    getAllPackingList = async (req,res,next) => {
        new SuccessResponse({
            message:'Get all packing list success',
            metadata:await PackingListService.getPackingListImport(req.query)
        }).send(res)
    };

    
    getPackingListByName=async(req,res,next)=>{
       
        new SuccessResponse({
            message:'Get all packing list name success',
            metadata:await PackingName.packinglistName(req.query)
        }).send(res)
    }

    getPackingListByColor=async(req,res,next)=>{
        new SuccessResponse({
            message:'Get All packing list color success',
            metadata:await PackingColor.packinglistColor(req.query)
        }).send(res)
    }

    
}

module.exports = new PackingListController()