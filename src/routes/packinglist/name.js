const express =require('express')
const packinglistController =require('../../controller/packinglist.controller')
const route= express.Router();
const asyncHandler = require('../../helpers/asyncHandler');

route.get('/',asyncHandler(packinglistController.getPackingListByName))

module.exports=route