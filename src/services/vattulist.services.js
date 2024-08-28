// const packinglistModel = require('../models/packinglist.model')
const { getVattuList} = require('../models/repositories/vatttulist.repo')
const db = require('../dbs/init.mysqldb')
const { BadRequest } = require("../core/error.response")
const VattuList = require('../models/vattulist.model')


class VattuListService {
    static getVattuList = async ({limit = 12000, offset = 0}) => {
      
        const allPackingNames = [];
        let batch;

        do {
            batch = await getVattuList({ limit, offset });

            console.log(`Processing batch starting at offset ${offset}`);

            allPackingNames.push(...batch);

            // Thêm logic xử lý dữ liệu tại đây
            batch.forEach(item => {
                console.log(`Processing item with mavattu: ${item.mavattu}`);
            });

            // Tăng offset để lấy lô tiếp theo
            offset += limit;

        } while (batch.length > 0);  
        // Tiếp tục nếu vẫn còn dữ liệu để lấy

        console.log('Batch processing completed successfully.');
        return allPackingNames;
    }
}

module.exports = VattuListService;
