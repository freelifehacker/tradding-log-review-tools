const express = require('express');
const router = express.Router();
const pdfHandler = require('../controller/pdfHandler');
router.get('/pdf', (req,res) => {
    pdfHandler.runUpdateData();
})
module.exports = router
