const packinglistModel = require('../models/packinglist.model')
const {getPackingListByName } = require('../models/repositories/packinglist.repo')
const db = require('../dbs/init.mysqldb')
const { BadRequest } = require("../core/error.response")

class PackingName {
    static packinglistName = async ({ten_vattu} ) => {

        console.log('ten_vattu:', ten_vattu);  
        if (!ten_vattu) throw new BadRequest('Missing parameter')

        const packingName = await getPackingListByName({ten_vattu});

        return packingName;
    }
}
module.exports=PackingName 