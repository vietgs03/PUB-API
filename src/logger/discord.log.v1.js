'use strict'

const {Client,GatewayIntentBits} = require("discord.js")
const client = new Client({
    intents:[
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.on('ready',()=>{
    console.log(`logged in as ${client.user.tag}!`)
})

client.login(token)

client.on('messageCreate',msg=>{
    if(msg.author.bot) return
    if(msg.content ==='hello')
    {
        msg.reply("Hello! How can i assits you today!")
    }
})