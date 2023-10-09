
const { db } = require('../../server');
const {  LOTS_COLLECTION } = require('../../constants');
const { Markup } = require('telegraf');


/**
   * Handle finish command from dev bot.
   */
module.exports = async (ctx) => {
    console.log('#finishHook')
    let userId = ctx.update.message.from.id;
    const querySnap = await db.collection(LOTS_COLLECTION)
    .where("owner.id","==", String(userId))
    .get();
    if(!querySnap.empty){
        const inline_keyboard = [];
        querySnap.forEach(snap=>{      
            const lot = snap.data();                       
            inline_keyboard.push([Markup.button.callback(lot.title, `FI#${snap.id}`,true)])
        })

        
        ctx.reply("Choose lot",{
            one_time_keyboard:true,
            reply_markup: {
                one_time_keyboard:true,
                inline_keyboard
            }
        });
    }else{
        ctx.reply("You do not have any lots");
    }
}