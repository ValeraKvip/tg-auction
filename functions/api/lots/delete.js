const { db } = require('../../server');
const { responseWithError, notifyUser } = require("../../utils");
const { USERS_COLLECTION, LOTS_COLLECTION } = require('../../constants');
const getUser = require('../users/getUser');
const {getBlankResponse} = require("../../utils");


/**
 * Handles lot delete action. 
 * @param {String} lotId - id of the lot to be deleted.
 */
module.exports = async (request, response) => {
    console.log('#delete');
    const { lotId } = request.body;
  

    if (!lotId) {
        return responseWithError(response, 6);
    }

    const lotRef = db.collection(LOTS_COLLECTION).doc(lotId);
    const lotDoc = await lotRef.get();
    if (!lotDoc.exists) {
        return responseWithError(response, 6)
    }

    const lot = lotDoc.data();
    lot.id = lotDoc.id;

    const user = await getUser(request, getBlankResponse({locals:response.locals}));
    const userRef = db.collection(USERS_COLLECTION).doc(String(user.id));

    if (user.id != lot.owner.id) {
        //fraud
        return responseWithError(response, 17)
    }

    if (lot.finished) {
        //Cannot remove finished lot.
        return responseWithError(response, 16)
    }
  
  
    const index = user.lots.findIndex((f) => f.id == lot.id);
    if (index !== -1) {
        user.lots.splice(index, 1);
        userRef.update(user);
    }

    //}


    //TODO #disable cron job for finish and for finish-line.

    await lotRef.delete()
    //TODO #return money to the players.


    const tasks = []

    //notify owner lot sold.
    if (lot.owner) {
        tasks.push(notifyUser(lot.owner.id,
            `Lot "${lot.title}" has been deleted. Don't do it so often or we'll ban you😘!`,
            'CAACAgIAAxkBAAOWZRcbS3K4T8snH8-Lui_DQeOmTMsAAisHAAJG-6wEefqoH-2zftAwBA'));
    }

    //notify players lot sold
    lot.players?.forEach(player => {
        if (player.id != lot.owner.id) {
            tasks.push(notifyUser(player.id,
                `Unfortunately, the owner has deleted the lot "${lot.title}"😔. All bids will be refunded as soon as possible (but no longer than a month😆).`,
                'CAACAgIAAxkBAAOYZRcbnZKHbApuz_60rVw2XTfm7cUAAlwHAAJG-6wES6Jfq08TsuMwBA'))
        }
    })

    await Promise.allSettled(tasks);

    response.sendStatus(200);
}