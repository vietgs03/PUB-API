// repo.js
const db = require('../../dbs/init.mysqldb');
const getConnection = db.getConnection();

const getAllPackingList = async ({ invoice_no, fromdate, todate }) => {
    const query = `SELECT * from packinglist_import`;

    return await db.executeQuery(query, [invoice_no, fromdate, todate]);
};

const getPackingListByName = async ({ten_vattu}) => {
    const query = `SELECT * from packinglist_import WHERE LOWER(ten_vattu) = LOWER(?)`;
 
    return await db.executeQuery(query, [ten_vattu]);
};

const getPackingListByColor=async ({color})=>{
    const query ='SELECT *from packinglist_import WHERE LOWER(color) LIKE LOWER(?)';
    return await db.executeQuery(query,[color]);
}


module.exports = {
    getAllPackingList,
    getPackingListByName,
    getPackingListByColor

};
