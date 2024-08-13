// repo.js
const db = require('../../dbs/init.mysqldb');
const getConnection = db.getConnection();

const getAllPackingList = async ({ invoice_no, fromdate, todate }) => {
    const query = `SELECT * from packinglist_import`;

    return await db.executeQuery(query, [invoice_no, fromdate, todate]);
};

module.exports = { getAllPackingList };
