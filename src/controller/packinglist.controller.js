const PackingListService =require('../services/packinglist.services')


const {OK,CREATED,SuccessResponse}  = require("../core/success.response")

class PackingListController {

    getAllPackingList = async (req,res,next) => {
        new SuccessResponse({
            message:'Get all packing list success',
            metadata:await PackingListService.getPackingListImport(req.query)
        }).send(res)
    };

    
    
    

    checkStatus = async (req,res,next) => {
        new SuccessResponse({
            message:'Get status packing list success',
            metadata:await PackingListService.checkStatus(req.query)
        }).send(res)
    }

    insertPackingList = async (req,res,next) => {
        new SuccessResponse({
            message:'Insert packing list success',
            metadata:await PackingListService.insertPackingList(req.body)
        }).send(res)
    }

    compare = async (req,res,next) => {
        new SuccessResponse({
            message:'Compare packing list success',
            metadata:await PackingListService.compare(req.body)
        }).send(res)
    }

    getPackingListByField=async(req,res,next)=>{
        new SuccessResponse({
            message:"Get packing by filed success",
            metadata:await PackingListService.getPackingListByField(req.query)
        }).send(res)
    }

}

module.exports = new PackingListController()