const  mongoose  = require("mongoose")
const {db:{host,port,name}} = require("../configs/config.mongodb")
const {countConnect} = require('../helpers/check.connect')
const connectString =`mongodb://${host}:${port}/${name}`

class Database {
    constructor(){
        this.connect()
    }
    // connect 
     connect(type ='mongodb'){
        if(1 === 1 )
        {
            mongoose.set('debug',true)
            mongoose.set('debug',{color:true})
        }
        
        mongoose.connect(connectString,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(_ =>{
            console.log("Connected MongoDb ",countConnect())
        })
        .catch(err => console.log(`error`))

    }
    static getInstance()
    {
        if(!Database.instance)
        {
            Database.instance = new Database()
        }
        return Database.instance
        
    }
}
const instanceMongodb=Database.getInstance();
module.exports =instanceMongodb