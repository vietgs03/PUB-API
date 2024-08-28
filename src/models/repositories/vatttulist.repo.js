// repo.js
const db = require('../../dbs/init.mysqldb');
const getConnection = db.getConnection();



const createIndexIfNotExists = async () => {
    const query = `
        CREATE INDEX IF NOT EXISTS idx_mavattu ON llx_vattu(mavattu);
    `;
    try {
        await db.executeQuery(query);
        console.log('Index created successfully or already exists.');
    } catch (error) {
        console.error('Failed to create index:', error);
        throw error;
    }
};


createIndexIfNotExists();


const getVattuList = async ({ limit = 12000, offset = 0 }) => {
   
   
    const query = `
      SELECT  pre.mavattu, pre.tenvattu, pre.donvi, pre.macu, pre.status
    FROM (
        SELECT  mavattu
        FROM llx_vattu
        ORDER BY mavattu ASC
        LIMIT ? OFFSET ?
    ) AS temp
    INNER JOIN llx_vattu AS pre ON temp.mavattu = pre.mavattu
    ORDER BY pre.mavattu ASC; `;

 
    return await db.executeQuery(query, [parseInt(limit), parseInt(offset)]);

    
   
}

module.exports = { getVattuList };