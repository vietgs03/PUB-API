const express =require('express')
const packinglistController =require('../../controller/packinglist.controller')
const route= express.Router();
const asyncHandler = require('../../helpers/asyncHandler');

// get all packing list

route.get('/',asyncHandler(packinglistController.getAllPackingList))
route.get('/checkStatus',asyncHandler(packinglistController.checkStatus))
route.post('/insertPackingList',asyncHandler(packinglistController.insertPackingList))
route.post('/compare',asyncHandler(packinglistController.compare))
// curl http://localhost:5000/api/packinglist/?invoice_no=1&fromdate=2020-01-01&todate=2020-01-01
route.get('/',asyncHandler(packinglistController.getPackingListByName))




module.exports=route