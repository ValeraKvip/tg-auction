const process = require('process');
const ngrok = require("@ngrok/ngrok");
const fs = require("fs");
const config = require('./functions/config.json');
const firebaseConfig = require('./firebase.json');

async function setup() {
    console.log("\x1b[32m%s\x1b[0m", '# Setup ngrok');

    try {
        const { NGROK_AUTHTOKEN,  BOT_TOKEN_DEV } = config;
       // const botToken = BOT_TOKEN_DEV ;
        if (!NGROK_AUTHTOKEN) {
            console.error("\x1b[31m%s\x1b[0m", 'NGROK_AUTHTOKEN unset. Please, set NGROK_AUTHTOKEN in config.js.')
            console.info("%s \x1b[34m%s\x1b[0m %s", 'Follow the link:', 'https://dashboard.ngrok.com/get-started/your-authtoken', 'to get the token.\n')
            process.exit(1);
        }

        if (!BOT_TOKEN_DEV) {
            console.error("\x1b[31m%s\x1b[0m", 'BOT_TOKEN_DEV unset. Please, set BOT_TOKEN_DEV in config.js.')
            console.info("%s \x1b[34m%s\x1b[0m %s", 'Follow the link:', 'https://core.telegram.org/bots/api#authorizing-your-bot', 'for more info.\n')
            process.exit(1);
        }



        const { emulators } = firebaseConfig;
        if (!emulators) {
            console.error("\x1b[31m%s\x1b[0m", 'firebase emulators not configured. Please, setup firebase emulators')
            console.info("%s \x1b[34m%s\x1b[0m %s", 'Follow the link:', 'https://firebase.google.com/docs/emulator-suite/install_and_configure', 'to install and configure.\n')
            process.exit(1);
        }

        await ngrok.authtoken(NGROK_AUTHTOKEN);
        const devConfig = {};
        const { hosting, functions } = emulators;

        if (!functions?.port || !hosting?.port) {
            console.error("\x1b[31m%s\x1b[0m", 'In the firebase.json, you have to configure the ports for both function and hosting emulators.')
            console.info("%s \x1b[34m%s\x1b[0m %s", 'Follow the link:', 'https://firebase.google.com/docs/emulator-suite/install_and_configure#port_configuration', 'for more info.\n')
            process.exit(1);
        }

        if (functions?.port) {
            const url = await ngrok.connect({ addr: functions.port });
            console.log("\x1b[32m%s\x1b[0m", `functions tunneled at the port:${functions.port}.`);
            console.log("\x1b[34m%s\x1b[0m", url);
            devConfig.ngrokFunctions = url;
        }

        if (hosting?.port) {
            const url = await ngrok.connect({ addr: hosting.port });
            console.log("\x1b[32m%s\x1b[0m", `hosting tunneled at the port:${hosting.port}.`);
            console.log("\x1b[34m%s\x1b[0m", url);
            devConfig.ngrokHosting = url;
        }

        fs.writeFileSync("./config-dev.json", JSON.stringify(devConfig));

        console.log("\x1b[32m%s\x1b[0m", '# Setup Telegram Webhook.')
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN_DEV}/setWebhook?url=${devConfig.ngrokFunctions}/${process.env.GCLOUD_PROJECT}/us-central1/app/api/hook`);
        if (response.ok) {
            console.log("\x1b[32m%s\x1b[0m", '# Telegram Webhook is set.')
        } else {
            console.error("\x1b[31m%s\x1b[0m", 'Telegram Webhook set error.', response.statusText);
            process.exit(1);
        }


        
        if (process.argv?.includes('--mock-db')) {
            console.log("\x1b[32m%s\x1b[0m", '# Setup db mock');
            await fetch(`${devConfig.ngrokFunctions}/${process.env.GCLOUD_PROJECT}/us-central1/app/api/dev/mockDatabase`);
            console.log("\x1b[32m%s\x1b[0m", '# db mock is set. emulators UI:');
            console.log("\x1b[34m%s\x1b[0m", 'http://localhost:4000');          
        }
        
        console.log("\x1b[31m%s\x1b[0m", '############### DANGER #################');
        console.log("\x1b[32m%s\x1b[0m",`Follow the link to install the Telegram webhook for PRODUCTION bot`);
        console.log("\x1b[34m%s\x1b[0m",`https://api.telegram.org/bot${config.BOT_TOKEN}/setWebhook?url=https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/app/api/hook`);
        
        console.log("\x1b[31m%s\x1b[0m", '########################################');

      
        console.log("\x1b[32m%s\x1b[0m",`To install the deeplinks, follow the instructions: https://github.com/ValeraKvip/tg-auction/wiki/Guide#setup-deeplink`);
        console.log("\x1b[32m%s\x1b[0m",`Use this link:`);
        console.log("\x1b[34m%s\x1b[0m",`${devConfig.ngrokHosting}`);
        console.log("\x1b[32m%s\x1b[0m", '# Done! Do not close the terminal until you are finished');

     

        process.stdin.resume();
    } catch (e) {
        console.error("\x1b[31m%s\x1b[0m", '# Error', e);
        process.exit(1);
    }
}


[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, exit);
})


function exit() {
    console.log("\x1b[32m%s\x1b[0m", '# Close ngrok');
    ngrok.disconnect();

    if (config.BOT_TOKEN_DEV) {
        fetch(`https://api.telegram.org/bot${config.BOT_TOKEN_DEV}/deleteWebhook`).catch(() => { });
    }
    fs.writeFileSync("./config-dev.json", JSON.stringify({}));
    process.exit();
}


setup();