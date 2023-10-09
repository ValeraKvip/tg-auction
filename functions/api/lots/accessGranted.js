const { notifyUser, getDeepLink } = require("../../utils");
const getUser = require('../users/getUser');
const {getBlankResponse} = require("../../utils");


/**
 * Handles access granted from web App. 
 * @param {String} initData - A string with raw data transferred to the Mini App.
 *  @see https://core.telegram.org/bots/webapps#initializing-mini-apps#requestWriteAccess
 */
module.exports = async (request, response) => {
    console.log('#accessGranted');
   
    const user = await getUser(request, getBlankResponse({locals:response.locals}));
   
    await notifyUser(user.id,
        `Hey there!!! Buy lots or organize your own auction! let's rock!`,
        'CAACAgIAAxkBAAIBO2UZk6-DDuoDl6UVh7w3nmkKkaagAAI2BwACRvusBAqX86rdUV82MAQ', {
        reply_markup: {
            inline_keyboard: [[{
                text: "Organize an auction",
                url: getDeepLink('create')
            }]              
            ]
        }
    })

    return response.sendStatus(200);
}