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


    const getVattuList = async ({ limit = 100, lastMavattu = null }) => {
        let query = `
            SELECT pre.mavattu, pre.tenvattu, pre.donvi, pre.macu, pre.status
            FROM llx_vattu AS pre
        `;
    
        const params = [];
    
        if (lastMavattu) {
            // Điều kiện để lấy các bản ghi có mavattu lớn hơn lastMavattu (con trỏ)
            query += ` WHERE pre.mavattu > ?`;
            params.push(lastMavattu);
        }
    
        query += ` ORDER BY pre.mavattu ASC LIMIT ?`;
        params.push(parseInt(limit));
    
        return await db.executeQuery(query, params);
    };
    
    module.exports = { getVattuList };