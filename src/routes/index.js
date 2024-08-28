const express = require('express');

const route = express.Router();

debugger

route.use('/v1/packinglist', require('./packinglist/index'))

//check permission

module.exports = route