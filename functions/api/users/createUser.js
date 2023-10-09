const { db } = require('../../server');
const { USERS_COLLECTION } = require('../../constants');


/**
 * Handles user creation action. 
 * @return created user or updated with id.
 * 

 */
module.exports = async (request, response) => {
    console.log('#createUser');
    const userData = response.locals.userData;
    const userId = userData.id;

    const docRef = db.collection(USERS_COLLECTION).doc(String(userId));
    const userDoc = await docRef.get();
    let user = {}
    if (userDoc.exists) {
        user = userDoc.data();
    }

    user.name = `${userData.first_name} ${userData.last_name || ''}`.trim() || user.name;
    user.language_code = userData.language_code || 'en';
    user.avatar = userData.photo_url || 'https://avatars.githubusercontent.com/u/1538423';
    user.telegramId = userData.id;

    const docData = await docRef.set(user);
    user.id = userId;
    
    return response.status(200).json(user);
}