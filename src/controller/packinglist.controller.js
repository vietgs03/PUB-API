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

<<<<<<< HEAD
    getPackingListByColor=async(req,res,next)=>{
        new SuccessResponse({
            message:'Get All packing list color success',
            metadata:await PackingColor.packinglistColor(req.query)
        }).send(res)
    }

    
=======
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
>>>>>>> upstream/main
}

module.exports = new PackingListController()