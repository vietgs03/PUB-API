const express = require('express');

const route = express.Router();

debugger

route.use('/v1/api/getPackingList', require('./packinglist/index'))

route.use('/v1/api/getPackingListName', require('./packinglist/name'))

route.use('/v1/api/getPackingListColor', require('./packinglist/color'))


//check permission

module.exports = route;