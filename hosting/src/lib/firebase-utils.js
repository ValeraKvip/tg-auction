import firebaseConfig from '$lib/firebase-config';


export async function getFunctionsEndpoint() {

    if (import.meta.env.MODE == 'development') {
        const devConfig = await import('../../../config-dev.json');
        if (devConfig && devConfig.ngrokFunctions) {
            return `${devConfig.ngrokFunctions}/${firebaseConfig.projectId}/us-central1/app/api`
        } else {
            return `http://localhost/${firebaseConfig.projectId}/us-central1/app/api`
        }
    }

    return `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/app/api`
}


export async function getShareLink() {
    return `https://t.me/share/url?url=${import.meta.env.VITE_TELEGRAM_DEEP_LINK}`
}