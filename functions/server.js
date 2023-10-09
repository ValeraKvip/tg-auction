/**
 * The entry point of the server.
 * This is where all components are initialized.
 */

const {  Telegraf } = require('telegraf');
const config = require("./config.json")
const process = require('process');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const admin = require('firebase-admin');


admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT });
const db = admin.firestore();

const app = express();

var hostingURL =  `https://${process.env.GCLOUD_PROJECT}.web.app`;
if(config.CUSTOM_DOMAIN){
    hostingURL =  `https://${config.CUSTOM_DOMAIN}`;
}

if (process.env.FUNCTIONS_EMULATOR) {
    const configDev = require("../config-dev.json");
    if (configDev && configDev.ngrokHosting) {
        hostingURL = configDev.ngrokHosting;
    }
}


const  origin = hostingURL;


var corsOptions = {
    origin:true,
}

app.use(cors(corsOptions)); 
app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json())

let botToken =   config.BOT_TOKEN;
if (process.env.FUNCTIONS_EMULATOR ){
    botToken = config.BOT_TOKEN_DEV
}
const bot = new Telegraf(botToken, {
    telegram: { webhookReply: true },
});



process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


module.exports = {
    app: app,
    db: db,
    bot: bot,
    hostingURL:hostingURL,
    botToken
}