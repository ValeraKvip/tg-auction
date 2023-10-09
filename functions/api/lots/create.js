const { db } = require('../../server');
const { responseWithError, notifyUser, getDeepLink } = require("../../utils");
const { LOTS_COLLECTION, USERS_COLLECTION } = require('../../constants');
const getUser = require('../users/getUser');
const {getBlankResponse} = require("../../utils");

/**
 * Handles action lot create. 
 * @param {String} title - lot title. length:[3,64]
 * @param {String} description - lot description.  length:[3,1024]
 * @param {String} preview - link to the lot preview.  length:[7,150]
 * @param {String} images - optional array of link to the lot images. length:[7-150] each. Max array size = 5.
 * @param {Number} startBid - lot start bid [1,1000].
 * @param {String} initData - A string with raw data transferred to the Mini App.
 *  @see https://core.telegram.org/bots/webapps#initializing-mini-apps
 *  @return { lotId }, @param lotId is lot id.
 */
module.exports = async (request, response) => {
    console.log('#create');
    const { title, description, preview, images, startBid } = request.body;
    const userData = response.locals.userData;

    if (!(startBid >>> 0 === parseFloat(startBid))) {
        return responseWithError(response, 10);
    }

    const num = Number(startBid);
    if (num < 10 || num > 1_000) {
        return responseWithError(response, 11);
    }

    if (!title || title.length < 3 || title.length > 64) {
        return responseWithError(response, 12);
    }

    if (!description || description.length < 3 || description.length > 1024) {
        return responseWithError(response, 13);
    }

    if (!preview || preview.length < 7 || preview.length > 150) {
        return responseWithError(response, 14);
    }

    if (!/(http(s?)):\/\//i.test(preview)) {
        return responseWithError(response, 15);
    }
    
    const user = await getUser(request, getBlankResponse({locals:response.locals}));
    const userRef = db.collection(USERS_COLLECTION).doc(String(user.id));

    const lot = {
        title,
        description,
        preview,
        startBid,
        bid: 0,
        images: [],
        player: [],
        publishedAt: Date.now(),
        startAt: Date.now(),
        finishAt: (Date.now() + 7 * 24 * 60 * 60 * 1000),//7 days
        type: 1,
        saved: [],
        owner: {
            avatar: user.avatar,
            id: user.id,
            name: user.name
        }
    }
   
    const lotDoc = await db.collection(LOTS_COLLECTION).add(lot);
    lot.id = lotDoc.id;
    //TODO #create cron job fro finish and for finish-line

    if (!user.lots?.length) {
        user.lots = [];
    }

 
    user.lots.push({
        id: lotDoc.id,
        title
    })

    await userRef.set(user);
 
    //notify creator(owner) about success. 
    await notifyUser(user.id,
        `The lot "${lot.title}" has been successfully created! The auction will be completed in a week. Share the link to invite players.`,
        'CAACAgIAAxkBAAOXZRcbh6tADV61BtLWT6wpLDlF8lYAAk0HAAJG-6wE_YZlw2RrLFMwBA',
        {
            reply_markup: {
                inline_keyboard: [[{
                    text: "View",
                    url: getDeepLink(lot.id)
                },
                {
                    text: "Share",
                    url: encodeURI(`https://t.me/share/url?url=${getDeepLink(lot.id)}&text=Hello, I have put up a lot for auction: "${lot.title}" - Hurry up and take part`)
                }]]
            }
        })

    return response.status(200).json({ lotId: lot.id });
}
