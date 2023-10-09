const { Router } = require("express");
const { bot, hostingURL } = require('../../server');
const preCheckoutQuery = require('./preCheckoutQuery');
const { message } = require("telegraf/filters");
const { Markup } = require("telegraf");
const successfulPayment = require("./successfulPayment");
const finishLine = require("../lots/finishLine");
const finish = require("../lots/finish");
const deleteLot = require("../lots/delete");
const finishLineHook = require("./finishLineHook");
const deleteHook = require("./deleteHook");
const finishHook = require("./finishHook");
const { getBlankResponse } = require("../../utils");
const config = require('../../config.json');



const router = Router();
router.use(async function (request, response) {
    console.log('#hooks')
    const secretToken = request.get('X-Telegram-Bot-Api-Secret-Token')
   
    if (secretToken !== config['X-Telegram-Bot-Api-Secret-Token']) {
        return response.sendStatus(401);
    }

    bot.handleUpdate(request.body, response);


    /**
     * TODO #Set your terms.
     * To prevent any misunderstandings and possible legal issues, make sure your bot can respond to a /terms command
     * @see https://core.telegram.org/bots/payments#live-checklist
     */
    bot.command('terms', async (ctx) => {
        //TODO #localize your terms.
        await ctx.sendSticker('CAACAgIAAxkBAAP1ZRhW_ATYr0mqcBIQBZWk_XFgxs4AAlUHAAJG-6wErjXk_JDzlvQwBA');
        await ctx.reply(`
    🔶1. Absolutely Everyone can put up their lot and get a link to it to invite players.
🔶2. All lots are public
🔶3. All bids are public.
🔶4. The minimum lot price is $10. Maximum 10000$.
🔶5. The highest 🎮bidder at the end of the auction wins. The one who pays $10,000 closes the auction ⚡early and wins.
🔶6. The player pays for each bid. The 💰money on his account is frozen until the end of the auction or until someone outbids him. Then the 💰money is unfrozen (we do not charge any fees - the payment service may).
🔶7. The organizer of the sold lot pays the 🎩service a reward of 💰5%.
🔶8. The organizer receives the money as soon as the postal provider confirms the successful receipt of the lot by the buyer.
🔶9. The money is returned to the player only if the 💩organizer of the lot has not sent it to the buyer. 
🔶10. Disputes between players are resolved in the MMA cage.\n\n
☝ By using the service you accept the terms and conditions`)
    });


    bot.command('finishLine', finishLineHook);

    bot.command('finish', finishHook);

    bot.command('delete', deleteHook);




    /**
     * TODO #Crate support channel.
     * Your bot must provide support for its customers, either by responding to a /support command or by some other clearly communicated means.
     * @see https://core.telegram.org/bots/payments#live-checklist
     */
    bot.command('support', async (ctx) => {
        await ctx.reply(`We are working hard and tirelessly to process your request!`)
    });


    //TODO #Remove. You can send a sticker to the bot and get its id printed to the terminal. To use in SendSticker. Delete if not needed. 
    bot.on('sticker', async (ctx) => {
        console.log('#Sticker', ctx.update.message.sticker);
    });


    bot.on('callback_query', async (ctx) => {

        const data = ctx.update.callback_query.data;

        if (process.env.FUNCTIONS_EMULATOR) {
            const extra = {
                locals: {
                    userData: {
                        id: ctx.from.id
                    }
                }
            };

            if (data.includes('FL#')) {

                const id = data.split('#')[1];
                request.body.lotId = id;
                ctx.editMessageReplyMarkup(Markup.removeKeyboard());
                let res = await finishLine(request, getBlankResponse(extra));
                if (res?.message) {
                    return ctx.reply(res.message);
                }
            } else if (data.includes('FI#')) {

                const id = data.split('#')[1];
                request.body.lotId = id;
                ctx.editMessageReplyMarkup(Markup.removeKeyboard());

                let res = await finish(request, getBlankResponse(extra));

                if (res?.message) {
                    return ctx.reply(res.message);
                }
            }
            else if (data.includes('FD#')) {

                const id = data.split('#')[1];
                request.body.lotId = id;
                ctx.editMessageReplyMarkup(Markup.removeKeyboard());

                let res = await deleteLot(request, getBlankResponse(extra));

                if (res?.message) {
                    return ctx.reply(res.message);
                }
            }
        }

    })
    bot.on("pre_checkout_query", preCheckoutQuery);
    bot.on("successful_payment", successfulPayment);

    bot.on(message('text'), async (ctx) => {

        await ctx.reply(`With this bot, you can create an auction for your lot. Or take part in the purchase of the lot`, Markup.inlineKeyboard([{
            text: "Get started",
            web_app: {
                url: hostingURL
            }
        }]));
    });

})
module.exports = router;

