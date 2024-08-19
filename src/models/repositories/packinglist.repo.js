// repo.js
const db = require('../../dbs/init.mysqldb');
const getConnection = db.getConnection();

const getAllPackingList = async ({ invoice_no, fromdate, todate }) => {
    const query = `SELECT * from packinglist_import`;

    return await db.executeQuery(query, [invoice_no, fromdate, todate]);
};

<<<<<<< HEAD
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
=======
const checkStatus = async ({invoice_no})=>{
    const query = `SELECT DISTINCT status FROM packinglist_import WHERE invoice_no = ?`;

    return await db.executeQuery(query, [invoice_no]);
}
const getBienBanGiamDinh = async ({invoice_no})=>{
    if(!invoice_no) throw new BadRequest('Missing invoice_no')
    const query = `            
            SELECT 
                rowid,
                name_packing,
                ma_vattu,
                ten_vattu,
                slPacking,
                slThucte,
                slQuydoi,
                description2 AS type
            FROM bienBan_giamdinh
            WHERE invoice_no = ?`
    return await db.executeQuery(query, [invoice_no])

}

const getPackList = async ({invoice_no})=>{
    if(!invoice_no) throw new BadRequest('Missing invoice_no')
    const query = `            
            SELECT 
                ma_vattu,
                FOB_CM_ET AS type,
                sl,
                sl slThucte,
                sl_met slQuydoi
            FROM packinglist_import
            WHERE invoice_no = ?
            `
    return await db.executeQuery(query, [invoice_no])
}


module.exports = { getAllPackingList ,checkStatus,getBienBanGiamDinh,getPackList};
>>>>>>> upstream/main
