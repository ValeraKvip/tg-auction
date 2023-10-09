const { db } = require('../../server');
const { Router } = require("express");
const process = require('process');

const router = Router();

if (process.env.FUNCTIONS_EMULATOR) {   
    const mock = require("../../mock/MockDatabase");

    router.get('/mockDatabase', (request, response) => {
        mock(db);
        response.sendStatus(200)
    });

}

module.exports = router;