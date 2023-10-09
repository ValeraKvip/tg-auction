import { collection, query, getDocs, limit, orderBy, where } from "firebase/firestore";
import { db } from "$lib/db";
import { user } from "$lib/store.js";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    let _user;

    user.subscribe((u) => {
        _user = u;
    });


    try {
        const q = query(
            collection(db, "lots"),
            limit(30),
            orderBy("publishedAt"),
            where("owner.id",'==',String(_user.id))
        );

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