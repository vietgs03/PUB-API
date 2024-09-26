'use strict'
const {createClient} = require('redis');
const { RedisErrorRespone } = require('../core/error.response');
require('dotenv').config()
let client = {}, statusConnectRedis = {
    CONNECT:'connect',
    END:'end',
    RECONNECT:'reconnecting',
    ERROR:'error'
},connectTimeout,connectInterval;

const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
    code :-99,
    message:{
        vn: ` Không thể kết nối đến Redis trong ${REDIS_CONNECT_TIMEOUT} ms`,
        en: `Cannot connect to Redis in ${REDIS_CONNECT_TIMEOUT} ms`
    }
}

const handleTimeoutError = () => {
    connectTimeout = setTimeout(() => {
        throw new RedisErrorRespone({
            message:REDIS_CONNECT_MESSAGE.message.vn,
            statusCode:REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT);
}

const handleEventConnect = ({
    connectionRedis
})=>{
    // check if connect null 
    connectionRedis.on(statusConnectRedis.CONNECT,()=>{
        console.log(`connectionRedis - Connection status: connected`)
        clearTimeout(connectTimeout);
    })

    connectionRedis.on(statusConnectRedis.END,()=>{
        console.log(`connectionRedis - Connection status: disconnected`)
        handleTimeoutError();
    })
    
    connectionRedis.on(statusConnectRedis.RECONNECT,()=>{
        console.log(`connectionRedis - Connection status: reconnecting`)
        clearTimeout(connectTimeout);
    })

    connectionRedis.on(statusConnectRedis.ERROR,(error)=>{
        console.log(`connectionRedis - Connection status: ERROR ${error}`)
        handleTimeoutError();
    })

    connectionRedis.connect();
}

const initRedis = () => {
    try {
      const instanceRedis = createClient({
        url:'redis://124.158.10.10:6379'
      });

      client.instanceConnect = instanceRedis;
      handleEventConnect({ connectionRedis: instanceRedis });
    } catch (error) {
      console.log('Error in Redis initRedis', error);
    }
  };

const getRedis = () => client


const closeRedis = () => client.instanceConnect.disconnect();

module.exports = {
    initRedis,
    getRedis,
    closeRedis,
    client
}