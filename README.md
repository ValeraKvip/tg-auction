# Install

1. `git clone https://github.com/ValeraKvip/tg-auction.git`
2. Make sure you have installed firebase cli  and are logged in [@see](https://firebase.google.com/docs/cli)
3. Make sure you have the latest versions of **node.js** and **npm** installed
4. Open project root folder in termianl
5. Type: `npm install` 
6. Type: `cd hosting` then: `npm install`
7. Type  `cd..` then: `cd functions` then: `npm install`

# Setup
Before the first launch, you have to obtain the API keys and add them to the project.
## Firebase
1. Go to [firebase console](https://console.firebase.google.com/)
2. "Add Project".
3. Enter any name and select the desired project ID.
4. Enable/Disable Google Analytics for this project.
5. Select or create new account.
6. Once created, go to the project console.
7. In the sidebar select Build -> Firestore Database
8. Click "Create database"
9. Select "Start in production mode", click **Next**
10. You can [choose any region](https://firebase.google.com/docs/projects/locations?hl=en&authuser=0&_gl=1*1wgl5n6*_ga*MTE3NTM4MjU0MC4xNjg4MDIzNDg4*_ga_CW55HF8NVT*MTY5NjM1MTQwOS4xMDguMS4xNjk2MzUyMTk5LjM1LjAuMA..). The project was created and tested on "nam5(United States)" - so if any region is suitable for you, it is better to use this one to avoid problems (Otherwise, you will have to find and replace the current "us-central1" region with a new one throughout the project ).
11. In the sidebar select "Spark No-cost" and click **Upgrade**
12. Select "Blaze" plan. Create a payment account and switch to this plan. Don't worry, you will still have a large free quota.
13. In the sidebar select **Gear Button** -> **Project Settings**
14. Click the button that looks like this: `</>`<br>
    ![firebase web app icon](https://i.imgur.com/0cqYH0D.png)
15. Type app nickname.
16. Click "Register app".
17.  Here is your firebaseConfig.
18. Go to the project [root folder/hosting/src/lib](/hosting/src/lib).
19. Create&Open the "**firebase-config.js**" file and paste it. Like this:
```js
  export default {
    apiKey: "...",
    authDomain: "xxx.firebaseapp.com",
    projectId: "...",
    storageBucket: "xxx.appspot.com",
    messagingSenderId: "...",
    appId: "...",
    measurementId: "..."
  };
```

## Telegram
### Create bot
You have to create two bots. One for development and one for production.
Repeat the following steps twice to create two bots:
1. Go to [BotFather](https://t.me/BotFather)
2. Type `/newbot`
3. Give a name.
4. Give a username.
5. Copy the token. Looks like this: `8162125942:DLFcAWwYQXICFIM2Vus3sGy_OLR3LtFARlE`
This is a secret key, do not give it to anyone and do not publish it anywhere.
6. Go to the project [root folder/functions](/functions).
7. Create&Open the "**config.json**". Paste bot tokens like this:
```json
{
   //other keys
  "BOT_TOKEN":"YOUR_PRODUCTION_BOT_TOKEN",
  "BOT_TOKEN_DEV":"YOUR_DEVELOPMENT_BOT_TOKEN",
}
```
![Create Telegram Bot](https://i.imgur.com/5L37AK2.png)
### Create web app
You have to create two webapps. One for development and one for production.
Repeat the following steps twice to create two webapps:
1. Go to [BotFather](https://t.me/BotFather)
2. Type `/newapp`
3. Select your bot.
4. Enter title, description, upload photo.
5. Upload gif or skip `/empty`
6. For now, send any valid URL.(https://google.com/).
7. Enter short name.
8. Type `/myapps` and select created webapp.
9. Copy **Direct Link** value.
10. Go to the project [root folder/hosting](/hosting).
11. Create&Open two files. The "**.env.development**" - for dev bot, "**.env.production**" for production bot. paste deeplink like this:
```env
VITE_TELEGRAM_DEEP_LINK=https://t.me/your-deep-link
```
10. Go to the project [root folder/functions](/functions).
11. Create or Open the "**config.json**". Paste deeplinks like this:
```json
{
  //other keys
  "TG_DEEPLINK":"https://t.me/your-deep-link",
  "TG_DEEPLINK_DEV":"https://t.me/your-deep-link",
}
```
![Create Telegram Web App](https://i.imgur.com/XM87G7U.png)

### X-Telegram-Bot-Api-Secret-Token
To make sure that requests to the server come from Telegram, you need to set a secret header [X-Telegram-Bot-Api-Secret-Token](https://core.telegram.org/bots/api#setwebhook).<br>

1. Go to the project [root folder/functions](/functions).
2. Create or Open the "**config.json**". Paste your auth tokens like this:
```json
{
   //other keys
  "X-Telegram-Bot-Api-Secret-Token":"a8e92344-bd20-4ca7-a82e-6acfa491b7a7", // 1-256 characters. Only characters: [A-Z, a-z, 0-9, _ , - ] are allowed. 
}
```
You can enter [any](https://guidgenerator.com/) string that meets the requirements - or just generate a random GUID.

## Ngrok
Telegram bot requires an SSL connection to the server. Therefore, to connect your development environment, you need ngrok.
1. Go to [ngrok](https://ngrok.com/) and create account.
2. Go to [this](https://dashboard.ngrok.com/get-started/your-authtoken) page to get your auth token.
3. Go to the project [root folder/functions](/functions).
4. Create or Open the "**config.json**". Paste your auth tokens like this:
```json
{
   //other keys
  "NGROK_AUTHTOKEN":"YOUR_AUTH_TOKEN", 
}
```
## Setup a payment provider
The project has implemented the test provider for Stripe. When you connect a real one, you will have to implement the payment process in accordance with the provider's API. The places where this should be done and what exactly are marked with `//TODO #`

### How to get a test payment key
1. Go to [BotFather](https://t.me/BotFather)
2. Type `/mybots`
3. Select your development bot.
4. Select **Payments**.
5. Find&Select **Stripe**.
6. Select **Connect Stripe Test**.
7. Click **Authorize** follow the link.
8. Click **Skip this form**.
9. Go back to the [BotFather](https://t.me/BotFather).
10. Copy your API. Looks like this: `398484122:TEST:TgD4sMg9DQx6LsoP`
11. Go to the project [root folder/functions](/functions).
12. Create or Open the "**config.json**". Paste your auth tokens like this:
```json
{
   //other keys
  "PAYMENT_PROVIDER_TOKEN":"YOUR_PROD_AUTH_TOKEN", 
  "PAYMENT_PROVIDER_TOKEN_DEV":"YOUR_DEV_AUTH_TOKEN"
}
```
The production bot must contain a real payment token `PAYMENT_PROVIDER_TOKEN`. But if you want to connect a test payment provider at the early stages, repeat the steps described above for the production bot.

# Run dev
1. Go to the project [root folder/hosting](/hosting)
2. Open terminal and Type `npm run dev`
3. Open the project root folder in another terminal.
4. Type <br>
`firebase emulators:exec 'npm run dev' --ui  --only  'functions,firestore'`<br>
 or<br>
 `firebase emulators:exec 'npm run dev-mock' --ui  --only  'functions,firestore'`<br>
 to run and mock database.<br>
### Setup deeplink
A link will be printed in the terminal. 
```
Use this link:
https://8b52-xxx-xxx-xx-xxx.ngrok-free.app
```
Or your can find it [config-dev.json](config-dev.json) -> **ngrokHosting**
1. Go to [BotFather](https://t.me/BotFather)
2. Type `/myapps`
3. Select your development app.
4. Select **Edit Web App URL**
5. Paste and Send.

Done! Open the bot and write `/start`.

Note: you can test the application on the same host. That is, in a browser or desktop application, you can also try to set up a mobile emulator. Unfortunately, the firestore emulator cannot work with a remote host. Therefore, you can open the app on your android device, but you cannot use the database.

# TODO \#
Open the search in your editor and search for `TODO #` - these are special comment tags that you need to work on before deploying (for real users, you can ignore these TODOs if you are deploying your app for testing or demo) your app. 
It would be overkill to integrate, for example, a payment provider and use its API - because there are dozens of such providers and each has its own API - but you have **TODO comments** that will indicate **where** it should be done and **what** exactly.

# Deploy
You don't need to build - it's ready to deploy.
But if you changed the code and used a typescript, don't forget to build it.

1. Open the root directory in terminal or VSCode terminal
2. `firebase deploy` <br><br>
**It deploys the following:**
* New releases of your Firebase Hosting sites <br>
* New or existing Cloud Functions <br>
* Rules for Cloud Storage <br>
* Rules for Cloud Firestore <br>
* Indexes for Cloud Firestore <br>


3. Go to Firebase console -> Hosting
under the **Domains** section - you can see the domain of your hosting something like `[PROJECT_ID].web.app` - Copy the link.<br><br>
![firebase domain](https://i.imgur.com/6H4WmAQ.png)
4. Go to [@BotFather](https://t.me/BotFather)
5. Type: `/myapps` then select your production web app. Then click `Edit Web App URL` -> Paste your domain
6. You have to set [webhook](https://core.telegram.org/bots/api#setwebhook)
7. The Webhook is printed to the console during the [dev run](https://github.com/ValeraKvip/tg-auction#run-dev) under `DANGER` - you just need to follow the link.<br><br>
![set prodauct webhook](https://i.imgur.com/HQAXUnT.png)

# Test
During testing, you don't want to wait a week to check if the end of the action and the selection of the winner works correctly. That's why several bot commands have been implemented  to simplify testing:

`/finishLine` - Trigger the "hour to finish" event and notify everyone who participated or was interested.<br>
`/finish` - Trigger the " finish " event and notify everyone who participated and the initiator.<br>
`/delete` - Deletes a lot.

# Troubleshooting
If you encounter any errors during deployment, be sure to check the log (the path should be printed to the terminal). Here are some of the most common ones:

> Error: spawn npm --prefix "%RESOURCE_DIR%" run lint ENOENT

Try one of the solutions in this post [@see](https://stackoverflow.com/questions/48345315/error-deploying-with-firebase-on-npm-prefix-resource-dir-run-lint) 

> Your project [YOUR_FIREBASE_PROJECT_ID] must be on the Blaze (pay-as-you-go) plan to complete this command. Required API cloudbuild.googleapis.com can't be enabled until the upgrade is complete.

Yes, you have to change the tariff plan, but the free quota of each month will still remain.
There should be a link printed, just follow it and change the plan. Or go to the console and change the plan there

> CORS

This can happen if you use your own domain or launch the project incorrectly. If you are using [custom domain](https://firebase.google.com/docs/hosting/custom-domain):
1. Go to `functions/config.json`
2. Insert your domain  to `CUSTOM_DOMAIN` only domain, without http or etc.
3. re-deploy.

> **ERR_NGROK_3004**, **ERR_NGROK_3200**.

If you see this message when you open the app:<br>
1. You haven't [started](https://github.com/ValeraKvip/tg-auction#run-dev) the dev server or it was closed due to a critical error. Open the terminal - go to the root folder `cd hosting` then `npm run dev` Do not close the terminal!
2. Remember every time you [restart](https://github.com/ValeraKvip/tg-auction#run-dev) the development environment - the buttons in the development bot are no longer relevant and will open an outdated ngrok url. You have to write `/start` to the bot and it will send you the relevant buttons.
3. Have you [set up](https://github.com/ValeraKvip/tg-auction#setup-deeplink) a deep link? 

> 500 Internal error

Server error. (functions directory) See logs to find the error.

> FirebaseError: The query requires an index. You can create it here: https://...

The firestore database needs to create [indexes](https://firebase.google.com/docs/firestore/query-data/index-overview) for complex [queries](https://firebase.google.com/docs/firestore/query-data/queries). The easy way is to follow the link, and the index will be created automatically. But then there will be an out-of-sync with the [firestore.indexes.json](/firestore.indexes.json) file in your project. Therefore, it is more correct to create indexes in this file and then [deploy](https://firebase.google.com/docs/reference/firestore/indexes) them. Especially if you are going to continue to keep your code as open source.<br>
You can also create indexes by clicking on links and then export them locally. Open a terminal in the root directory:
```
firebase firestore:indexes > firestore.indexes.json
```
