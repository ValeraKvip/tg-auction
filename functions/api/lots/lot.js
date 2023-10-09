const { Router } = require("express");
const { tgvVerifyMiniApp, responseWithError } = require("../../utils");
const bid = require('./bid');
const create = require("./create");
const deleteLot = require("./delete");
const favorite = require("./favorite");
const accessGranted = require("./accessGranted");


const router = Router();
router.use(async function (request, response, next) {
  console.log('#lot$')
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

router.post('/bid', bid);
router.post('/create', create);
router.delete('/delete', deleteLot);
router.post('/favorite', favorite);
router.post('/accessGranted', accessGranted);


module.exports = router;