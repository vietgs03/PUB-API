// repo.js
const db = require('../../dbs/init.mysqldb');

const getAllPackingList = async ({ invoice_no, fromdate, todate }) => {
    const query = `SELECT * from packinglist_import`;

    return await db.executeQuery(query, [invoice_no, fromdate, todate]);
};

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
                description2 AS type,
                dac_diem_nhan_dang
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
                sl_met slQuydoi,
                dac_diem_nhan_dang,
                ten_vattu
            FROM packinglist_import
            WHERE invoice_no = ?
            `
    return await db.executeQuery(query, [invoice_no])
}


module.exports = { getAllPackingList ,checkStatus,getBienBanGiamDinh,getPackList};
