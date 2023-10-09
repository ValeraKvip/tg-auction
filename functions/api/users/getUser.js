const { db } = require('../../server');
const { USERS_COLLECTION } = require('../../constants');
const createUser = require('./createUser');

/**
 * Handles get user action. 
 * @return existing user or created.
 */
module.exports = async (request, response) => {
    console.log('#getUser');
    const userData = response.locals.userData;
    const userId = userData.id;

    const userDoc = await db.collection(USERS_COLLECTION).doc(String(userId)).get();
  
    if (userDoc.exists) {
       const user = userDoc.data();   
        user.id = userDoc.id;
        return response.status(200).json(user);         
    }

    return createUser(request, response);
}