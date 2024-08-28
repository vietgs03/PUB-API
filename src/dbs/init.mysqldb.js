const mysql = require('mysql');
const { db: { host, port, user, password, name } } = require('../configs/config.mysql');

class Database {
    constructor() {
        this.initPool();
    }

    initPool() {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: host,
            port: port,
            user: user,
            password: password,
            database: name,
            waitForConnections: true,
            queueLimit: 0
        });

        this.pool.on('error', (err) => {
            console.error(`MySQL Pool Error: ${err.message}`);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('Reinitializing MySQL pool due to connection loss...');
                this.initPool(); 
            }
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    // Execute a query
    executeQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error(`Error getting MySQL connection: ${err.message}`);
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        this.initPool(); 
                    }
                    return reject(err);
                }

                connection.query(query, params, (queryErr, results) => {
                    connection.release(); 

                    if (queryErr) {
                        if (queryErr.fatal) {
                            console.error('Fatal error occurred, recreating pool...');
                            this.initPool(); 
                        }
                        this.handleQueryError(queryErr, query, params);
                        return reject(queryErr);
                    }
                    resolve(results);
                });
            });
        });
    }

    handleQueryError(err, query, params) {
        console.error('Query Error:', err.message);
        console.error('Query:', query);
        console.error('Params:', params);
    }
}

const instanceMysql = Database.getInstance();
module.exports = instanceMysql;
