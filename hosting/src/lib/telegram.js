export function getTelegramApp(){
    if(!window || !window.Telegram || !window.Telegram.WebApp){
        return null;
    }

    return window.Telegram.WebApp;
}

export function getTelegramUserId(){
    const app = getTelegramApp();
    if(!app){
        return null;
    }
    return app.initDataUnsafe?.user?.id;
}