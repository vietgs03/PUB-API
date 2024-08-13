
const dev = {
    app: {
        port :process.env.MYSQL_APP_PORT ||3000
    },
    db: {
        host:process.env.MYSQL_DB_HOST || 'localhost',
        port:process.env.MYSQL_DB_PORT || '27017',
        name:process.env.MYSQL_DB_NAME || 'ShopDev',
        user:process.env.MYSQL_DB_USER || 'root',
        password:process.env.MYSQL_DB_PASSWORD || 'ThsaA@141',
    }
}


const product = {
    app: {
        port :process.env.MYSQL_APP_PORT || 3000
    },
    db: {
        host:process.env.MYSQL_DB_HOST || 'localhost',
        port:process.env.MYSQL_DB_PORT || '27017',
        name:process.env.MYSQL_DB_NAME || 'ShopDev',
        user:process.env.MYSQL_DB_USER || 'root',
        password:process.env.MYSQL_DB_PASSWORD || 'ThsaA@141',
    }
}
const config={dev,product}
const env = process.env.NODE_ENV || 'dev'
console.log(config[env],env)
module.exports=config[env]