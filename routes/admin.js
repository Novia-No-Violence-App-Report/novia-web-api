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

function timeStamp() {
    Date.prototype.today = function () {
        return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
    }
    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
    }

    return new Date().today() + " " + new Date().timeNow();

}

module.exports = router