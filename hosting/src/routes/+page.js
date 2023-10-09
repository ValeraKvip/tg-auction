import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "$lib/db";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    try {
        const q = query(collection(db, "lots"), limit(8), orderBy("publishedAt"));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            let lots = querySnapshot.docs.map((d) => {
                const data = d.data();
                data.id = d.id;
                return data;
            });
           
            return { lots };
        }
    } catch (e) {
        console.error(e);
    }
    return {};
}