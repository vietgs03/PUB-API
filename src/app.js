require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const {default:helmet} = require("helmet")
const compression = require("compression")
const app = express()

// init middlewares
app.use(morgan("dev"))

app.use(helmet())
app.use(compression()) // giảm tải 
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({
    extended:true,
    parameterLimit:100000,
    limit:'50mb'
}))
// init db
// require('./dbs/init.mongodb')
require('./dbs/init.mysqldb')

// init route
app.use('/',require('./routes'))
// handling error
app.use((req,res,next)=>{
    const error = new Error('Not found')
    error.status=404
    next(error)
})
app.use((error,req,res,next)=>{
    const statusCode =error.status || 500
    return res.status(statusCode).json({
        status:'error',
        code:statusCode,
        message:error.message || 'Internal server error'
    })
})


module.exports = app