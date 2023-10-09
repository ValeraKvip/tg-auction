const { db } = require('../../server');
const { responseWithError } = require("../../utils");
const { USERS_COLLECTION, LOTS_COLLECTION } = require('../../constants');
const getUser = require('../users/getUser');
const {getBlankResponse} = require("../../utils");


/**
 * Handles action add/delete-favorite. 
 * @param {String} lotId - id of the lot.
 * @param {String} initData - A string with raw data transferred to the Mini App.
 *  @see https://core.telegram.org/bots/webapps#initializing-mini-apps
 */
module.exports = async (request, response) => {
    console.log('#favorite');
    const { lotId } = request.body;
   

    if (!lotId) {
        return responseWithError(response, 6);
      }
      
    const user = await getUser(request, getBlankResponse({locals:response.locals}));
   
    const userRef = db.collection(USERS_COLLECTION).doc(String(user.id));

    const lotRef = db.collection(LOTS_COLLECTION).doc(lotId);
    const lotDoc = await lotRef.get();
    if (!lotDoc.exists) {
        return responseWithError(response, 6);
    }

    const lot = lotDoc.data();
    lot.id = lotDoc.id;
    if (lot.finished) {
        return responseWithError(response, 2);
    }


    if (!user.favorite?.length) {
        user.favorite = []
    }

    if (!lot.saved?.length) {
        lot.saved = [];
    }


    const isFavorite = !user.favorite.some(p=>p.id == lot.id)

    if (isFavorite) {
        user.favorite.push({
            id: lot.id,
            title: lot.title
        });

        lot.saved.push({
            id: user.id,
            name: user.name,
            avatar: user.avatar
        });
    } else {
        let index = user.favorite.findIndex(p=>p.id == lot.id)
        if (index != -1) {
            user.favorite.splice(index, 1)
        }

        index = lot.saved.findIndex(p=>p.id == user.id)
        if (index != -1) {
            lot.saved.splice(index, 1)
        }
    }

    await Promise.allSettled([
        lotRef.set(lot),
        userRef.set(user)
    ]);

    return response.status(200).json({ favorite: isFavorite })
}