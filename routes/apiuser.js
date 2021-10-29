const express = require('express')
const router = express.Router()
const Firestore = require('@google-cloud/firestore');

// Initialize Firestore
const db = new Firestore({
    projectId: 'belajar-cloud-326815',
    keyFilename: 'service-account.json',
});

async function getUsers() {
    const snapshot = await db.collection('users').get()
    var data = []
    snapshot.forEach((doc) => {
        data.push(doc.data())
    });
    return data
}

async function addUser(user) {
    return await db.collection('users').doc(user.user_id.toString()).set(user)
}

router.get('/', async function (req, res, next) {
    res.json(await getUsers())
})

router.post('/', async function (req, res, next) {
    try {
        var response = addUser(req.body)

        res.json({
            time: await response.toString(),
            user_id: req.body.user_id,
            status_code: 204
        })
    } catch {
        res.json({
            time: null,
            user_id: null,
            status_code: 405
        })
    }
})

module.exports = router
