const { db } = require('../../server');
const { responseWithError, notifyUser, getDeepLink,getBlankResponse } = require("../../utils");
const { USERS_COLLECTION, LOTS_COLLECTION } = require('../../constants');
const getUser = require('../users/getUser');


/**
 * Handles action finish form cron job. 
 * @param {String} lotId - id of the lot to be finished.
 * @see https://docs.cron-job.org/rest-api.html
 */
module.exports = async (request, response) => {
    console.log('#finishAuction');
    const { lotId } = request.body;

    if (!lotId) {
        return responseWithError(response, 6)
    }

    const lotRef = db.collection(LOTS_COLLECTION).doc(lotId);
    const lotDoc = await lotRef.get();
    if (!lotDoc.exists) {
        return responseWithError(response, 6)
    }


    const lot = lotDoc.data();   
    lot.id = lotDoc.id;
    if (lot.finished) {

        return responseWithError(response, 2)
    }


    const timeDelta = Date.now() - (lot.finishAt);
    if (timeDelta > 60_000 && lot.bid != 10_000) {
        return response.sendStatus(400);
    }

    const user = await getUser(request, getBlankResponse({locals:response.locals}));   
    if (user.id != lot.owner.id && lot.bid != 10_000) {
        //fraud
        return responseWithError(response, 17)
    }

    const playerWinner = lot.players?.reduce((prev, current) => (prev && prev.bid > current.bid) ? prev : current);
    if (playerWinner) {
        lot.newOwner = playerWinner;
        const userRef = db.collection(USERS_COLLECTION).doc(String(playerWinner.id));
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            const user = userDoc.data();
            user.id = userDoc.id;
            if (!user.purchased?.length) {
                user.purchased = [];
            }
            user.purchased.push({
                id: lot.id,
                title: lot.title
            })

            userRef.update(user)
        }

      
    }
    //close lot.
    lot.finished = true;   
    lotRef.update(lot)


    //TODO #withdraw payment from winner.    

    const tasks = []

    //Check if someone has bid.
    if (!lot.players?.length) {
        notifyUser(lot.owner.id,
            `The "${lot.title}" auction is over. Unfortunately, no one bought the lot`,
            'CAACAgIAAxkBAAIBsGUaj9JcxhUUpQnDfdsJv0x-mFFHAAJSBwACRvusBJaYsWKjROibMAQ');
        return;
    }

    //notify owner lot sold.
    if (lot.owner) {
        tasks.push(notifyUser(lot.owner.id,
            `Congratulations! Your lot "${lot.title}" has been sold for $${lot.bid}. `,
            'CAACAgIAAxkBAAN1ZRb-vkYRGPML4Fe6zebsd4XtJUUAAksHAAJG-6wEmMJl6KNpDy4wBA', {
            reply_markup: {
                inline_keyboard: [[{
                    text: "View",
                    url: getDeepLink(lot.id)
                }]]
            }
        }));
    }

    //notify players lot sold
    lot.players?.forEach(player => {
        if (player.id === playerWinner.id) {
            tasks.push(notifyUser(player.id,
                `Congratulations! You've bought the "${lot.title}" lot for $${lot.bid}. `,
                'CAACAgIAAxkBAAN1ZRb-vkYRGPML4Fe6zebsd4XtJUUAAksHAAJG-6wEmMJl6KNpDy4wBA',
                {
                    reply_markup: {
                        inline_keyboard: [[{
                            text: "View",
                            url: getDeepLink(lot.id)
                        }]]
                    }
                }))

        } else {
            tasks.push(notifyUser(player.id,
                `Unfortunately, the "${lot.title}" lot was bought by another player.`,
                'CAACAgIAAxkBAAN2ZRb_GqPsRLPs_GURniC6Wd48ZNsAAjkHAAJG-6wE0Sfuq9Hg3CswBA'))
        }

    })

    await Promise.allSettled(tasks);
};