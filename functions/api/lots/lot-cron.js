const { Router } = require("express");
const { responseWithError } = require("../../utils");
const finishLine = require('./finishLine');
const finish = require("./finish");

const router = Router();
router.use(async function (request, response, next) {
    console.log('#lot-cron')
    const { lotId } = request.body;

    if (!lotId) {
        return responseWithError(response, 6);
    }

    next();
})

router.post('/finishLine', finishLine);
router.post('/finish', finish);


module.exports = router;