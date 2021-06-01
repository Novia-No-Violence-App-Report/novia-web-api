const express = require('express')
const router = express.Router()

router.get('/', async function (req, res, next) {
    res.render('../views/admin.ejs', {
        reports: [{
            isImportant: "true",
            report: "report 1",
            timestamp: "123123123"
        }, {
            isImportant: "false",
            report: "report 2",
            timestamp: "798879789"
        }]
    })
})

module.exports = router