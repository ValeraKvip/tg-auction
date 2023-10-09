const { Router } = require("express");
const process = require('process');
const lot = require('./lots/lot');
const hook = require('./hooks/hook');
const lotCron = require('./lots/lot-cron');
const users = require('./users/user');




const router = Router();
router.use('/lots', lot);
router.use('/hook', hook);
router.use('/lot-cron', lotCron);
router.use('/users', users);

if (process.env.FUNCTIONS_EMULATOR) {
    const dev = require('./dev/dev');
    router.use('/dev', dev);
}


module.exports = router;