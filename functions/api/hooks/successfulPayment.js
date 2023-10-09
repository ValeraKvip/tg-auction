const { db } = require('../../server');
const { notifyUser } = require("../../utils");
const { USERS_COLLECTION, LOTS_COLLECTION } = require('../../constants');


/**
   * User successful payment - save payment charge.
   * @see https://core.telegram.org/bots/api#successfulpayment
   */
module.exports = async (ctx) => {
    console.log('#SuccessfulPayment', ctx)
    //TODO #Save to db successfulpayment object - use it for refunds.
}