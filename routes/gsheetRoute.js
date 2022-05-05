const express = require('express')
const router = express.Router()
const googleSheets = require('../controllers/gsheetController')

router.get('/spreadsheet/:spreadsheetId', fetchgsheet)
router.post('/spreadsheet/update', updategsheet)

async function fetchgsheet(req, res, next){
    googleSheets.fetchData(req.params)
    .then( data => {
        res.json(data).send()
    })
}

async function updategsheet(req, res, next){
    googleSheets.updateData(req.body)
    .then( data => {
        res.json(data).send()
    })
}

module.exports = router