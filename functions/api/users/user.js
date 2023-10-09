const { Router } = require("express");
const { tgvVerifyMiniApp, responseWithError } = require("../../utils");
const createUser = require('./createUser');
const getUser = require("./getUser");





const router = Router();
router.use(async function (request, response, next) {
  console.log('#users')
  const { initData } = request.body;


  if (!initData) {
    return responseWithError(response, 1);
  }

  const urlParams = new URLSearchParams(initData);
  if (!urlParams.has('user')) {
    return responseWithError(response, 5);
  }

  const userData = JSON.parse(urlParams.get('user'));
  if (!userData?.id) {
    return responseWithError(response, 5);
  }

  //Check data is valid and from telegram - in other case it's fraud.
  const isValid = await tgvVerifyMiniApp(initData);
  if (!isValid) {
    return responseWithError(response, 1);
  }


  response.locals.userData = userData;
  next()
})


router.delete('/createUser', createUser);
router.post('/getUser', getUser);


module.exports = router;