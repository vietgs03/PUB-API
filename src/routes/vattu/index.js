const express =require('express')
const vattulistController =require('../../controller/vattulist.controller')
const route= express.Router();
const asyncHandler = require('../../helpers/asyncHandler');

route.get('/vattu',asyncHandler(vattulistController.getVattuList))

module.exports=route