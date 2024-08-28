const packinglistModel = require('../models/packinglist.model')
const {getAllPackingList,checkStatus,getBienBanGiamDinh,getPackList} =require('../models/repositories/packinglist.repo')
const db = require('../dbs/init.mysqldb')
const {BadRequest} = require("../core/error.response")
const PackingList = require('../models/packinglist.model')
class PackingListService {
    static getPackingListImport = async ({invoice_no,fromdate,todate})=>{

        if(!invoice_no || !fromdate || !todate) throw new BadRequest('Missing parameter')

        const packinglist = await getAllPackingList({invoice_no,fromdate,todate})

        return packinglist
    }

    static insertPackingList = async (packinglist) => {
        const tableName = 'packinglist_import';
        const requestId = Date.now();
        console.log(packinglist.data[0]?.invoice_no);

        const invoice_no = packinglist.data[0]?.invoice_no;
        // Lấy user
        const user = packinglist.user

        if (!invoice_no) throw new BadRequest('Không tìm thấy Invoice No');
    
        // Kiểm tra trạng thái của packing list
        const statusResult = await this.checkStatus({ invoice_no });
    
        const status = statusResult[0]?.status;
    
        // Nếu trạng thái là 2 thì không cho phép insert
        if (status === 2) {
            throw new BadRequest(`Packing list của ${invoice_no} đã đóng và không thể chèn thêm.`);
        }
    
        // Nếu trạng thái là 1, tiếp tục kiểm tra tồn tại và xóa packing list cũ nếu có
        await this.checkAndDeleteExistPackingList({ invoice_no });
    
        // Chuẩn bị dữ liệu để chèn
        const valueToInsert = packinglist.data.map((item) => {
            const packinglistInstance = new PackingList({
                ...item,
                request_id: requestId,
                updated_by: user,
                created_by: user,
                tanggiam:'tang'
            });
            return Object.values(packinglistInstance);
        });
    
        const columns = Object.keys(new PackingList({})).join(', ');
        const placeholders = new Array(Object.keys(new PackingList({})).length).fill('?').join(', ');
    
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    
        for (const values of valueToInsert) {
            await db.executeQuery(query, values);
        }
        this.updateMavattu( requestId );
        this.updateTenvattu( requestId );
        this.updateInvoiceno( invoice_no );
        this.insertStockMouvement( requestId );
        return { message: `Packing list của ${invoice_no} đã được tạo mới thành công` };
    };
    
    static checkStatus = async ({invoice_no})=>{

        if(!invoice_no) throw new BadRequest('Missing parameter')

        const status = await checkStatus({invoice_no})

        return status
    }

    static checkAndDeleteExistPackingList = async ({ invoice_no }) => {
        if (!invoice_no) throw new BadRequest('Không tìm thấy Invoice No');

        const queryCheck = `SELECT COUNT(*) FROM packinglist_import WHERE invoice_no = ?`;
        const check = await db.executeQuery(queryCheck, [invoice_no]);

        if (check[0]['COUNT(*)'] == 0) return { message: `Packing list của ${invoice_no} không tìm thấy` };

        const queryDeleteStock = `
            DELETE llx_stock_mouvement 
            FROM llx_stock_mouvement
            LEFT JOIN packinglist_import ON llx_stock_mouvement.fk_origin = packinglist_import.rowid
            WHERE packinglist_import.invoice_no = ?
        `;

        await db.executeQuery(queryDeleteStock, [invoice_no]);

        const queryDeletePackingList = `DELETE FROM packinglist_import WHERE invoice_no = ?`;

        await db.executeQuery(queryDeletePackingList, [invoice_no]);

        return { message: `Packing list của ${invoice_no} đã được xóa` };
    };

    static updateMavattu = async (requestId)=>{

        let query = `
            UPDATE packinglist_import SET ma_vattu_vtec = CONCAT(
                COALESCE(hinh_thuc_nhap, '-'),
                CASE 
                    WHEN COALESCE(hinh_thuc_gia_cong, '-') = 'FOB' THEN '0' 
                    WHEN COALESCE(hinh_thuc_gia_cong, '-') = 'CM' THEN 'G'
                    ELSE '-'
                END,
                COALESCE(mancc, '-'),
                COALESCE(ma_nam, '-'),
                '-',
                COALESCE(chung_loai_vai, '-'),
                COALESCE(ma_vattu, '-'),
                COALESCE(khovai, '-')
            )
            WHERE request_id = ?`
        return await db.executeQuery(query, [requestId])
    }

    static updateTenvattu = async (requestId)=>{

        let query = `                
                UPDATE packinglist_import pi
                LEFT JOIN llx_vattu vt ON pi.ma_vattu = vt.mavattu
                SET ten_vattu_vtec = vt.tenvattu
                WHERE pi.request_id = ?`

        return await db.executeQuery(query, [requestId])
    }

    static updateInvoiceno = async (invoice_no)=>{
        let query = `Update packinglist_import pi left join bienBan_giamdinh bg on pi.invoice_no=bg.invoice_no set pi.so_chung_tu=bg.so_chung_tu where bg.invoice_no = ?`
        return await db.executeQuery(query, [invoice_no])
    }

    static insertStockMouvement = async (requestId) => {
        let query = `
            INSERT INTO llx_stock_mouvement (
                tms, 
                datem, 
                fk_product, 
                batch, 
                eatby, 
                sellby, 
                fk_entrepot, 
                value, 
                price, 
                type_mouvement, 
                fk_user_author, 
                label, 
                inventorycode, 
                fk_project, 
                fk_origin, 
                origintype, 
                model_pdf, 
                fk_projet, 
                color, 
                maVattu, 
                maVattu_vtec
            ) 
            SELECT 
                NOW(), 
                ngay_nhan_hang, 
                vt.rowid,
                DATE_FORMAT(ngay_nhan_hang, '%d.%m.%Y') AS batch,
                NOW(), 
                NOW(), 
                e.rowid, 
                CASE 
                    WHEN pi.tanggiam = 'tang' THEN pi.sl 
                    ELSE -pi.sl 
                END AS value,
                pi.unit_price,
                1,
                1,
                'Packing list Import',
                pi.loai_packing,
                1,
                pi.rowid,
                'packinglist',
                '',
                0,
                pi.color,
                pi.ma_vattu,
                pi.ma_vattu_vtec
            FROM 
                packinglist_import pi
            LEFT JOIN 
                llx_vattu vt 
                ON vt.mavattu = CASE 
                                    WHEN LENGTH(pi.ma_vattu) < 6 THEN CONCAT(pi.ma_vattu, REPEAT('-', 6 - LENGTH(pi.ma_vattu)))
                                    ELSE pi.ma_vattu
                                END
            LEFT JOIN 
                llx_entrepot e 
                ON e.ref = pi.loai_packing
            WHERE 
                IFNULL(vt.rowid, 0) <> 0 
                AND pi.request_id = ?
            ORDER BY e.rowid;
        `;
    
        return await db.executeQuery(query, [requestId]);
    };
    
    static compare = async (invoice_no) => {
        // Lấy dữ liệu biên bản giám định
        const groupByOption = invoice_no.groupByOption;
        const bienbanData = await getBienBanGiamDinh(invoice_no);
        if (bienbanData.length === 0) throw new BadRequest('Không tìm thấy biên bản ghi');
    
        // Lấy dữ liệu packing list
        const packinglistData = await getPackList(invoice_no);
        if (packinglistData.length === 0) throw new BadRequest('Không tìm thấy packing list ghi');
    
        // Tạo một map để lưu tên vật tư dựa trên mã vật tư (ma_vattu)
        const tenVattuMap = bienbanData.reduce((acc, item) => {
            acc[item.ma_vattu] = item.ten_vattu;
            return acc;
        }, {});
    
        // Gom nhóm dữ liệu biên bản giám định theo `ma_vattu`, `type`, và `groupByOption` (nếu có)
        const bienbanTotals = bienbanData.reduce((acc, item) => {
            const { ma_vattu, type, slPacking, slThucte, slQuydoi } = item;
            const groupKey = groupByOption ? item[groupByOption] || 'default' : 'default';
    
            if (!acc[ma_vattu]) acc[ma_vattu] = {};
            if (!acc[ma_vattu][type]) acc[ma_vattu][type] = {};
            if (!acc[ma_vattu][type][groupKey]) acc[ma_vattu][type][groupKey] = { slPacking: 0, slThucte: 0, slQuydoi: 0 };
    
            acc[ma_vattu][type][groupKey].slPacking += parseFloat(slPacking) || 0;
            acc[ma_vattu][type][groupKey].slThucte += parseFloat(slThucte) || 0;
            acc[ma_vattu][type][groupKey].slQuydoi += parseFloat(slQuydoi) || 0;
    
            return acc;
        }, {});
    
        // Gom nhóm dữ liệu packing list theo `ma_vattu`, `type`, và `groupByOption` (nếu có)
        const packingListTotals = packinglistData.reduce((acc, item) => {
            const { ma_vattu, type, sl, slThucte = 0, slQuydoi = 0 } = item;
            const groupKey = groupByOption ? item[groupByOption] || 'default' : 'default';
    
            if (!acc[ma_vattu]) acc[ma_vattu] = {};
            if (!acc[ma_vattu][type]) acc[ma_vattu][type] = {};
            if (!acc[ma_vattu][type][groupKey]) acc[ma_vattu][type][groupKey] = { slPacking: 0, slThucte: 0, slQuydoi: 0 };
    
            acc[ma_vattu][type][groupKey].slPacking += parseFloat(sl) || 0;
            acc[ma_vattu][type][groupKey].slThucte += parseFloat(slThucte) || 0;
            acc[ma_vattu][type][groupKey].slQuydoi += parseFloat(slQuydoi) || 0;
    
            return acc;
        }, {});
    
        // So sánh các tổng hợp dữ liệu
        const result = {};
    
        for (const [ma_vattu, types] of Object.entries(bienbanTotals)) {
            const ten_vattu = tenVattuMap[ma_vattu] || 'Tên vật tư không xác định'; // Lấy tên vật tư từ map
            result[ma_vattu] = {  }; // Thêm tên vật tư vào kết quả
    
            for (const [type, groupKeys] of Object.entries(types)) {
                result[ma_vattu][type] = {};
                for (const [groupKey, totals] of Object.entries(groupKeys)) {
                    const packingListTotal =
                        packingListTotals[ma_vattu] &&
                        packingListTotals[ma_vattu][type] &&
                        packingListTotals[ma_vattu][type][groupKey];
    
                    if (packingListTotal) {
                        result[ma_vattu][type][groupKey] = {
                            slPackingMatch: totals.slPacking === packingListTotal.slPacking,
                            slThucteMatch: totals.slThucte === packingListTotal.slThucte,
                            slQuydoiMatch: totals.slQuydoi === packingListTotal.slQuydoi,
                            groupKeyMatch: groupKey === (packingListTotal[groupByOption] || 'default'),
                            bienBanTotal: totals,
                            packingListTotal: packingListTotal,
                            ten_vattu: ten_vattu
                        };
                    } else {
                        result[ma_vattu][type][groupKey] = {
                            slPackingMatch: false,
                            slThucteMatch: false,
                            slQuydoiMatch: false,
                            groupKeyMatch: false,
                            bienBanTotal: totals,
                            packingListTotal: {
                                slPacking: 0,
                                slThucte: 0,
                                slQuydoi: 0
                            },
                            ten_vattu: ten_vattu
                        };
                    }
                }
            }
        }
    
        return result;
    };
    
    
}

module.exports = PackingListService