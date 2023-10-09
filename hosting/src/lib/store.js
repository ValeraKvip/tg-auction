import { writable } from 'svelte/store';


export const menuButtonsPurchased = writable(false);
export const menuButtonsMyLots = writable(false);

export const user = writable(null);