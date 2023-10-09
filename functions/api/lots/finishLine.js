const { db } = require('../../server');
const { responseWithError, notifyUser, getDeepLink, getBlankResponse } = require("../../utils");
const {  LOTS_COLLECTION } = require('../../constants');
const getUser = require('../users/getUser');

/**
 * Handles action finish-line(1 hour to finish) form cron job. 
 * @param {String} lotId - id of the lot.
 * @see https://docs.cron-job.org/rest-api.html
 */
module.exports = async (request, response) => {
    console.log('#finishLine');
    const { lotId } = request.body;

    if (!lotId) {
        return responseWithError(response, 6)
    }

    const lotDoc = await db.collection(LOTS_COLLECTION).doc(lotId).get();
    if (!lotDoc.exists) {
        return responseWithError(response, 6)
    }

    const lot = lotDoc.data();
    lot.id = lotDoc.id;
    if (lot.finished) {
        return responseWithError(response, 2)
    }

    const user = await getUser(request, getBlankResponse({locals:response.locals}));   
    if (user.id != lot.owner.id) {
        //fraud
        return responseWithError(response, 17)
    }

    const lotUrl = getDeepLink(lot.id);
    const sticker = 'CAACAgIAAxkBAAOIZRcUUoavW0JMTvyc7lUxgdn37lUAAjQHAAJG-6wEd_D3hEkGwR4wBA';
    const tasks = []
    //notify players 
    lot.players?.forEach(player => {
        tasks.push(notifyUser(player.id,
            `There is less than an hour left until the end of the "${lot.title}" lot auction - hurry up!`,
            sticker,
            {
                reply_markup: {
                    inline_keyboard: [[{
                        text: "View",
                        url: lotUrl
                    }]]
                }
            }))
    })

    //notify users who saved lot
    lot.saved?.forEach(player => {
        tasks.push(notifyUser(player.id,
            `You were interested in the "${lot.title}" lot, and there is less than an hour left until the end of the auction - hurry up!`,
            sticker,
            {
                reply_markup: {
                    inline_keyboard: [[{
                        text: "View",
                        url: lotUrl
                    }]]
                }
            }))
    })


    await Promise.allSettled(tasks);
}
