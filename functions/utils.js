const { bot, botToken } = require('./server');
const errors = require('./errors.json');
const config = require('./config.json');

/**
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app   
 * @param {*} initData - injected by telegram to the "window.Telegram.WebApp"
 *  @see https://core.telegram.org/bots/webapps#initializing-mini-apps
 * @returns true if data is from telegram app.
 */
async function tgvVerifyMiniApp(initData) {
    const crypto = require('crypto');
    const config = require("./config.json")

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    urlParams.sort();

    let dataCheckString = '';
    for (const [key, value] of urlParams.entries()) {
        dataCheckString += `${key}=${value}\n`;
    }

    dataCheckString = dataCheckString.slice(0, -1);


    const secretKey = crypto.createHmac('sha256', "WebAppData").update(botToken).digest();
    const checkHash = crypto.createHmac('sha256', secretKey).update(decodeURI(dataCheckString)).digest('hex');

    return hash == checkHash;
}


/**
 * Return telegram webapp Direct Link
 * @param {String} startapp - optional value will be passed to the web app .
 *  @see https://core.telegram.org/bots/webapps#direct-link-mini-apps
 */
 function getDeepLink(startapp) {
    let link = process.env.FUNCTIONS_EMULATOR ? config.TG_DEEPLINK_DEV : config.TG_DEEPLINK;

    if (startapp) {
        return `${link}?startapp=${startapp}`
    }
    return link

}


/**
 * Send message with sticker
 * @param {String|Number} id - Telegram user id.
 * @param {String} message - Text message.
 * @param {String} sticker - Sticker file id.
 * @param {*} extra - Keyboard or etc.
 *  @see https://telegraf.js.org/classes/Telegram.html#sendMessage.sendMessage-1
 */
async function notifyUser(id, message, sticker, extra) {
    if (sticker) {
        try{
            await bot.telegram.sendSticker(id, sticker);
        }
        catch(e){
            //If database mocked, id is wrong.
        }
      
    }

    try{
        await bot.telegram.sendMessage(id, message, extra);
    } 
    catch(e){
         //If database mocked, id is wrong.
    }
}


/**
 * Send errors helper
 * @see errors.json
 */
async function responseWithError(response, error_code) {
    const error = errors[error_code];
    if (error) {
        return response.status(error.server_status).json({
            message: error.message,
            error_code
        });
    }

    response.sendStatus(400);

}


/**
 * Stub for response
*/
function getBlankResponse(extra){
   
        const sendStatus = () => { return false };
      const   status = () => { return { json: (msg) => { return msg } } };
    

    if(extra){
        const stub= {...extra};
        stub.sendStatus = sendStatus;
        stub.status = status;
        return stub;
    }

    return {
        sendStatus,
        status
    };
}




module.exports = {
    tgvVerifyMiniApp,
    notifyUser,
    responseWithError,
    getDeepLink,
    getBlankResponse
}