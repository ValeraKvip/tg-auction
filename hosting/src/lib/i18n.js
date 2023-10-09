import { derived, writable } from "svelte/store"
import translation from "../locales/translation";

const fallback = 'en';
const locale = writable(fallback);

function translate(locale, key, values) {   
    let str = translation[locale][key];
    if (!str) {
        str = translation[fallback][key];
        if (!str) {
            return '';
        }
    }
   
    if (values) {
        Object.keys(values).forEach((placeholder) => {
            str = str.replace(new RegExp(`{${placeholder}}`, 'g'), values[placeholder]);
        });
    }

    return str;
}

export const t = derived(locale, ($locale) => (key, values = {}) =>
    translate($locale, key, values)
);

export function setLocale(newLocale) {   
    if (newLocale in translation) {
        locale.set(newLocale);
    }
}