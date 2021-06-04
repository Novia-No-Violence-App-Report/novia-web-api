const express = require('express')
const router = express.Router()
const Firestore = require('@google-cloud/firestore');

// Initialize Firestore
const db = new Firestore({
    projectId: 'research-station',
    keyFilename: 'service-account.json',
});

async function getReports() {
    const snapshot = await db.collection('reports').get()
    var data = []
    snapshot.forEach((doc) => {
        data.push(doc.data())
    });
    return data
}

router.get('/', async function (req, res, next) {
    res.render('../views/admin.ejs', {
        reports: await getReports()
    })
})

module.exports = router