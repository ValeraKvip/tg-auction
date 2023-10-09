const { db } = require('../../server');
const { notifyUser, getDeepLink, getBlankResponse } = require("../../utils");
const { USERS_COLLECTION, LOTS_COLLECTION } = require('../../constants');
const finish = require('../lots/finish');


/**
   * User paid - update the db.
   * @see https://core.telegram.org/bots/api#answerprecheckoutquery
   */
module.exports = async (ctx) => {
    console.log('#pre_checkout_query')
    let lotId = ctx.update.pre_checkout_query.invoice_payload;
    let bid = ctx.update.pre_checkout_query.total_amount / 100;
    let userId = ctx.update.pre_checkout_query.from.id;
    let checkoutId = ctx.update.pre_checkout_query.id;

    if (!lotId) {
        return ctx.answerPreCheckoutQuery(false, "lot id is wrong");

    }

    if (!userId) {
        return ctx.answerPreCheckoutQuery(false, "user id is wrong");
    }

    if (!bid || bid > 10_000) {
        return ctx.answerPreCheckoutQuery(false, "bid id is wrong");
    }

    let lotTitle = "";
    let prevPlayerWinner = null;
    try {
        const lotRef = db.collection(LOTS_COLLECTION).doc(lotId);
        const userRef = db.collection(USERS_COLLECTION).doc(String(userId));

        await db.runTransaction(async (transaction) => {
            //Check if lot exists.
            const lotSnap = await transaction.get(lotRef);
            if (!lotSnap.exists) {
                throw new Error("Lot not found or wrong.")
            }

            const lot = lotSnap.data();
            lot.id = lotSnap.id;
            lotTitle = lot.title;

            //Check lot finished.
            if (lot.finished) {
                throw new Error("The auction is over.");
            }

            //Check if lot actual.
            if (lot.bid >= bid) {
                throw new Error("The bid is no longer relevant.");
            }

            //Check if lot is active.
            const currentTime = Date.now();
            const lotFinishAt = Date.parse(lot.finishAt);
            if (lotFinishAt - currentTime < 0) {
                throw new Error("The auction is over.");
            }


            //get user from db.
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new Error("User not exists.")
            }

            const user = userDoc.data();
            user.id = userDoc.id;

            //add or update user as a player under the lot.
            const player = {};
            player.id = user.id;
            player.bid = bid;
            player.name = user.name;
            player.avatar = user.avatar;

            if (!lot.players?.length) {
                lot.players = [];
                lot.players.push(player);
            }
            else {
                prevPlayerWinner = lot.players.reduce((prev, current) => (prev && prev.bid > current.bid) ? prev : current);

                const index = lot.players.findIndex(p => p.id == player.id);

                if (index !== -1) {
                    lot.players[index] = player;
                } else {
                    lot.players.push(player);
                }
            }

            //if player previously saved lot, remove him from that list.           
            if (lot.saved?.length) {
                const index = lot.saved.findIndex(p => p.id == user.id);
                if (index !== -1) {
                    lot.saved.splice(index, 1);
                }
            }

            //add info about bid to user doc.
            const userBid = {
                lotId: lot.id,
                title: lot.title,
                bid: bid,
                checkoutId
                //TODO #transaction id.
                //TODO #Do you need "shipping_option_id"? @see https://core.telegram.org/bots/api#precheckoutquery
                //TODO #Do you need "order_info"? @see https://core.telegram.org/bots/api#precheckoutquery
            };

            //lot is public - keep userBid private in user.
            const lotBid = {
                lotId: lot.id,
                title: lot.title,
                bid: bid,
            }

            if (user.bids?.length) {
                const index = user.bids.findIndex(p => p.lotId == lot.id);
                if (index !== -1) {
                    user.bids[index] = userBid;
                } else {
                    user.bids.push(userBid);
                }
            } else {
                user.bids = [];
                user.bids.push(lotBid)
            }




            lot.bid = bid;

            transaction.update(userRef, user);
            transaction.update(lotRef, lot);
        })
    } catch (e) {
        console.error(e);

        ctx.answerPreCheckoutQuery(false, e.message || "error");
        return;
    }

    ctx.answerPreCheckoutQuery(true);

    //TODO #Unfreeze(or return) money for another players(use prevPlayerWinner).    

    try {

        if (prevPlayerWinner != null) {
            notifyUser(prevPlayerWinner.id,
                `Your bid ($${prevPlayerWinner.bid}) on lot: "${lotTitle}" was beaten by $${bid}`,
                'CAACAgIAAxkBAANaZRbp2hjOraeXCoiMKadhR2xPt7cAApgaAAKM0TFJ7vZvWLbIixgwBA',
                {
                    reply_markup: {
                        inline_keyboard: [[{
                            text: "Bid now",
                            url: getDeepLink(lotId)
                        }]]
                    }
                })
        }
    } catch (e) {
        console.error(e);
    }


    try {
        if (bid === 10_000) {
            const extra = {
                locals: {
                    userData: {
                        id:userId
                    }
                }
            };

            finish({
                body: {
                    lotId: lotId
                }
            }, getBlankResponse(extra));
        }
    } catch (e) {
        console.error(e);
    }
}