<<<<<<< HEAD
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
=======
// repo.js
const db = require('../../dbs/init.mysqldb');
const getConnection = db.getConnection();

const getAllPackingList = async ({ invoice_no ,fromdate, todate}) => {
    const query = ` SELECT tam.ma_vattu
    from(
    SELECT ma_vattu
    FROM  packinglist_import
    WHERE invoice_no = ?
  
    ORDER BY ma_vattu ASC
 
    )AS tempp
    INNER JOIN packinglist_import AS tam ON tempp.ma_vattu = tam.ma_vattu
    ORDER BY tam.ma_vattu ASC;`

    return await db.executeQuery(query, [invoice_no,fromdate, todate]);
};

const getPackingListByField = async ({ search }) => {
    const validFields = ['name_packing', 'ma_vattu', 'ten_vattu', 'ma_vattu_vtec', 'ten_vattu_vtec',
        'sl', 'sl_met', 'dvt', 'color', 'khovai', 'size', 'status', 'net_weight',
        'gross_weight', 'unit_price', 'amount', 'ngay_nhan_hang', 'description',
        'description2', 'PO_ref', 'job_ref', 'invoice_no', 'mancc', 'nhacungcap',
        'loai_packing', 'so_chung_tu', 'file_excel_name', 'sheet_name', 'hinh_thuc_nhap',
        'hinh_thuc_gia_cong', 'ma_nam', 'chung_loai_vai', 'FOB_CM_ET', 'updated_by',
        'created_by', 'request_id', 'tanggiam', 'makho', 'ART', 'dac_diem_nhan_dang'
    ];
    const conditions = []
    const params = []
    console.log('Search parameters received:', search);

    for (let field in search) {
        if (search.hasOwnProperty(field)) {
            if (validFields.includes(field.toLowerCase())) {
                let value = search[field];

                // Kiểm tra nếu giá trị có khoảng trắng ở đầu hoặc cuối
                if (value.startsWith(' ') || value.endsWith(' ')) {
                    value = value.trim(); // Loại bỏ khoảng trắng ở đầu và cuối nếu có
                }

                if (value) { // Kiểm tra lại sau khi trim, chỉ thêm điều kiện nếu có giá trị
                    conditions.push(`LOWER(${field}) LIKE LOWER(?)`);
                    params.push(`%${value}%`);
                }
            } else {
                console.warn(`Invalid field: ${field} - This field is ignored.`);
            }
        }
    }
    console.log('Conditions:', conditions);
    console.log('Params:', params);
    if (conditions.length === 0) {
        throw new Error("No valid search criteria provided");
    }

    const query = `SELECT * FROM packinglist_import WHERE ${conditions.join(' AND ')}`;
    console.log('Executing query:', query, 'with params:', params);
    return await db.executeQuery(query, params);
}





const checkStatus = async ({ invoice_no }) => {
    const query = `SELECT DISTINCT status FROM packinglist_import WHERE invoice_no = ?`;

    return await db.executeQuery(query, [invoice_no]);
}
const getBienBanGiamDinh = async ({ invoice_no }) => {
    if (!invoice_no) throw new BadRequest('Missing invoice_no')
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

const getPackList = async ({ invoice_no }) => {
    if (!invoice_no) throw new BadRequest('Missing invoice_no')
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




module.exports = {
    getAllPackingList,
  
    checkStatus, getBienBanGiamDinh, getPackList,
    getPackingListByField

};
>>>>>>> 74965a8ff4223a9d188915d201a7e35bffb4ba02
