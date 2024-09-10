// const packinglistModel = require('../models/packinglist.model')
const { getVattuList} = require('../models/repositories/vatttulist.repo')
const db = require('../dbs/init.mysqldb')
const { BadRequest } = require("../core/error.response")
const VattuList = require('../models/vattulist.model')


class VattuListService {
    static getVattuList = async ({limit = 100, lastMavattu = null }) => {
      
        const allPackingNames = [];
        let batch;
        let totalFetched = 0; // Biến để theo dõi tổng số bản ghi đã lấy
        const maxFetch = limit; // Giới hạn số bản ghi cần lấy

        do {
            batch = await getVattuList({ limit: Math.min(limit, maxFetch - totalFetched), lastMavattu });
            console.log(`Processing batch with limit: ${limit} and starting after mavattu: ${lastMavattu}`);

        

            allPackingNames.push(...batch);
            totalFetched += batch.length; 

            if (batch.length > 0) {
                lastMavattu = batch[batch.length - 1].mavattu; // Lấy mavattu cuối cùng trong lô hiện tại
            }

        } while (batch.length > 0 && totalFetched < maxFetch);
        // Tiếp tục nếu vẫn còn dữ liệu để lấy

        console.log('Batch processing completed successfully.');
        return allPackingNames;
    }
}

module.exports = VattuListService;
