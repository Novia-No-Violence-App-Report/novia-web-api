const fetch = require("node-fetch")
const express = require('express')
const router = express.Router()

router.get('/', async function (req, res, next) {
    fetch('http://newsapi.org/v2/everything?q=kekerasan+perempuan+anak&sortBy=publishedAt&apiKey=' + process.env.NEWS_API_KEY)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status)
                    res.json({
                        status: "not ok"
                    })
                    return
                }

                response.json().then(function (data) {
                    res.json(data)
                });
            }
        )
        .catch(function (err) {
            res.json({
                status: "not ok"
            })
        });
})

module.exports = router