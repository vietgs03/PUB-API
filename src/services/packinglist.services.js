const packinglistModel = require('../models/packinglist.model')
const {getAllPackingList} =require('../models/repositories/packinglist.repo')
const db = require('../dbs/init.mysqldb')
const {BadRequest} = require("../core/error.response")
class PackingListService {
    static getPackingListImport = async ({invoice_no,fromdate,todate})=>{

        if(!invoice_no || !fromdate || !todate) throw new BadRequest('Missing parameter')

        const packinglist = await getAllPackingList({invoice_no,fromdate,todate})

        return packinglist
    }
}

module.exports = PackingListService