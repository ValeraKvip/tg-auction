import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import firebaseConfig from '../../../firebase.json';
import config from '$lib/firebase-config';

var app;
var db;

if (!app) {
    app = initializeApp(config);
}

if (!db) {
    db = getFirestore(app);   
    if (import.meta.env.MODE == 'development' && !db._settingsFrozen) {
        connectFirestoreEmulator(db, 'localhost', firebaseConfig.emulators.firestore.port);
    }
}
export { db };