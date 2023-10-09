const { db, bot } = require('../../server');
const config = require('../../config.json');
const { responseWithError, getBlankResponse } = require("../../utils");
const {  LOTS_COLLECTION } = require('../../constants');
const getUser = require('../users/getUser');
const {responseBlank} = require("../../utils");

/**
 * Handles user`s bid.
 * @param {String} lotId - id of the lot for which the user bids.
 * @param {Integer} bid - The bid specified by the user.
 * @param {String} initData - A string with raw data transferred to the Mini App.
 *  @see https://core.telegram.org/bots/webapps#initializing-mini-apps
 * @returns { url }, @param url is the actual bid invoice.
 *   @see https://core.telegram.org/bots/api#createinvoicelink
 */



module.exports = async (request, response) => {
    //Check income data
    const { bid, lotId } = request.body;
    const userData = response.locals.userData;

    if (!lotId) {
        return responseWithError(response, 6);
      }
      
    /**
     * The minimum and maximum amounts for each of the currencies roughly correspond to the limit of US$ 1-10000
     * @see https://core.telegram.org/bots/payments#supported-currencies
     */
    if (bid > 10_000 || bid < 1) {
        return responseWithError(response, 6);
    }

    const user = await getUser(request,getBlankResponse({locals:response.locals}));
  
    //Check lot exists.
    const lotDoc = await db.collection(LOTS_COLLECTION).doc(lotId).get();
    if (!lotDoc.exists) {
        return responseWithError(response, 6);
    }
    const lot = lotDoc.data();
    lot.id = lotDoc.id;

    if (lot.owner?.id == user.id) {
        return responseWithError(response, 8);
    }

    if (lot.players?.length) {
        const currentLotWinner = lot.players.reduce((prev, current) => (prev && prev.bid > current.bid) ? prev : current);
        if (currentLotWinner && currentLotWinner.id == user.id) {
            return responseWithError(response, 9);
        }
    }


    //Check if lot is not finished.
    const currentTime = Date.now();
    const lotFinishAt = Date.parse(lot.finishAt);
    if (lotFinishAt - currentTime < 0) {
        return responseWithError(response, 2);
    }

    //Check if the bid amount is valid.
    if (lot.bid >= bid) {
        return responseWithError(response, 3);
    }

    /**
     * Price of the product in the smallest units of the currency.
     * For example, for a price of US$ 1.45 pass amount = 145.
     * @see https://core.telegram.org/bots/api#labeledprice
    **/
    const amount = bid * 100;

    /**
     * response with invoice link.
     * @see https://core.telegram.org/bots/api#createinvoicelink
    **/
    
    let paymentToken = config.PAYMENT_PROVIDER_TOKEN;
    if(process.env.FUNCTIONS_EMULATOR ){
        paymentToken =  config.PAYMENT_PROVIDER_TOKEN_DEV;
    }

    const res = await bot.telegram.createInvoiceLink({
        title: `${lot.title} bid`,
        description: `🥶The money will be frozen.\n🧐 If another player outbids you, the money will be unfrozen.\n🤠 If no one outbids you before the end of the auction, the money will be withdrawn and the lot will be yours`,
        payload: lot.id,
        currency: 'USD',
        provider_token:  paymentToken,
        prices: [{
            label: `${lot.title} bid`,
            amount
        }],
        photo_url: lot.preview
    })
    return response.json({ url: res });
}