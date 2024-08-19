const mysql = require('mysql');
const { db: { host, port, user, password, name } } = require('../configs/config.mysql');
class Database {
    constructor() {
        this.connect();
    }

    // Connect to MySQL
    connect() {
        this.connection = mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
            database: name,
        });

        this.connection.connect((err) => {
            if (err) {
                console.error(`Connection error: ${err.message}`);
                throw err;
            } else {
                console.log("Connected to MySQL");
            }
        });

        // Optional: Handle connection errors after the initial connection
        this.connection.on('error', (err) => {
            console.error(`MySQL error: ${err.message}`);
        });
    }

    // Singleton pattern implementation
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    // Get the current connection
    getConnection() {
        return this.connection;
    }
    handleQueryError(err,query,params){
        console.error('Query Error: ', err.message);
        console.error('Query: ', query);
        console.error('Params: ', params);

    }
    executeQuery = (query,params=[])=>{
        return new Promise ((resolve,reject)=>{
            this.connection.query(query,params,(err,results)=>{
                if(err) {
                    this.handleQueryError(err,query,params)
                    return reject(err)
                }
                resolve(results)
            })
        })
    }
}

const instanceMysql = Database.getInstance();
module.exports = instanceMysql;
