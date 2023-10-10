# About
The project was created from scratch specifically for the [Telegram Mini App Contest](https://t.me/contest/327)


The mini app is an auction. Any user can publicly post lots and buy them.

# Technologies
**Backend**: [firebase functions](https://firebase.google.com/docs/functions) + [Express.js](https://expressjs.com/)<br>
**Frontend**: [firebase hosting](https://firebase.google.com/docs/hosting) + [SvelteKit](https://kit.svelte.dev/).<br>
**Database**: [firestore](https://firebase.google.com/docs/firestore).<br>
**Bot API**: [Telegraf.js](https://telegrafjs.org/#/)<br>


# Development
An excellent development environment was [implemented](/setup-dev.js) in the application. Just one command launches server and database emulators, installs a webhook, and sets up an SSL connection for the bot. So you can test your mini application in isolation without affecting the production bot.
The application supports (or rather requires) working with two bots at once - development and production.

# Security
From the side of the mini application **Telegram web app -> Server** User authentication is checked using the Telegram.WebApp.initData object:
@See: [/functions/api/lots/lot.js](/functions/api/lots/lot.js)<br>
@See: [/functions/utils.js#tgvVerifyMiniApp](https://github.com/ValeraKvip/tg-auction/blob/5cf2f9aff98542b1ec033b8657a6be7d94125344/functions/utils.js#L11) <br>

From the webhook side, authentication is verified using a header X-Telegram-Bot-Api-Secret-Token:<br>
@See [/functions//api/hooks/hook.js](/functions//api/hooks/hook.js).


# Mini App API
**isVersionAtLeast** - Used to check the version before writing/reading to the cloud storage. [@see](/hosting/src/routes/lots/create/+page.svelte)<br>
**CloudStorage** - Used to save a [draft](/hosting//src/routes/lots/create/+page.svelte) when creating a lot, and for [tutorials](/hosting//src/components/slot/TutorialView.svelte)<br>
**openLink** - Used to distribute the share link.<br> 
**openInvoice** -Used for invoicing the bid for a lot [@see](/hosting/src/routes/lots/[lot]/+page.svelte) <br>
**requestWriteAccess** - The bot sends various messages to the user about the lot To do this, permission is requested from the User (permission may not be available if he clicked on the share link).<br>
**HapticFeedback.notificationOccurred** - To demonstrate successful or unsuccessful payment.<br>
**ThemeParams** - To synchronize the Telegram theme and the app <br>
**WebAppUser.language_code** - For localization. English(en) and Ukrainian(uk) are currently supported.<br>
**BackButton** - Used to handle backward navigation [@see](/hosting/src/routes/+layout.svelte) <br>
**MainButton** - Used to confirm tasks.  [@see](/hosting/src/routes/lots/create/+page.svelte)   [@see](/hosting/src/routes/lots/[lot]/+page.svelte) <br>

And others...

# NOTE
When you open the application, you will see a certain number of mock lots. If you have a question why when you add lots you do not see them in this list, it is because the developer has limited the display of new lots. In case all the apps in the contest are public and other participants could not publish any garbage.
You can find created lots in the menu or in the bot.
