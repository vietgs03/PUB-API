const packinglistModel = require('../models/packinglist.model')
const  {getPackingListByColor }= require('../models/repositories/packinglist.repo')
const db = require('../dbs/init.mysqldb')
const { BadRequest } = require("../core/error.response")

class PackingColor{
    static packinglistColor=async ({color})=>{
        if (!color) throw new BadRequest('Missing parameter')

            const packingColor = await getPackingListByColor(color);
    
            return packingColor
    }
}
module.exports=PackingColor