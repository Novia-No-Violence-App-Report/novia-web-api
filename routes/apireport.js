// Import dependencies
const express = require('express')
const router = express.Router()
const tf = require('@tensorflow/tfjs-node')
const vocab = require('../vocabulary/vocabulary.json')
let model = null

const Firestore = require('@google-cloud/firestore');

// Initialize Firestore
const db = new Firestore({
    projectId: 'research-station',
    keyFilename: 'service-account.json',
});

// Add classified report to Firestore
async function addReport(report, userId, importance) {
    const res = await db.collection('reports').add({
        importance: importance,
        report: report,
        timestamp: timeStamp(),
        user_id: userId
    });

    console.log('Added document with ID: ', res.id);
}

function paddingArray(sequence, padding) {
    const insertPadding = padding - sequence.length;
    for (let i = 0; i < insertPadding; i++) {
        sequence.unshift(0);
    }
    return sequence;
}

// Convert text to sequence using vocab.json
function textToSequence(rawInput) {
    const input = Array.isArray(rawInput) ? rawInput : [rawInput]
    console.log("\n\nINPUT\n" + input)
    return input.reduce(function (finalResult, currentInput) {
        const words = currentInput.toLowerCase().split(" ")
        const sequence = words.reduce(function (result, current) {
            if (vocab[current]) result.push(vocab[current])
            return result
        }, [])
        finalResult.push(paddingArray(sequence, 53))
        return finalResult
    }, [])
}

router.post('/', async function (req, res, next) {
    try {
        const modelUrl = "https://storage.googleapis.com/novia_model/models/model.json"

        let report = req.body.report
        let userId = req.body.user_id

        if (!model) model = await tf.loadLayersModel(modelUrl)
        const input = textToSequence(req.query.report)
        const result = await model.predict(tf.tensor2d(input))
        const resultImportance = argMax(result.dataSync())

        if (resultImportance === 0)
            addReport(report, userId, "low")
        else if (resultImportance === 1)
            addReport(report, userId, "high")

        res.json({
            report: req.query.report,
            importance: resultImportance,
            msg: "Laporan anda sudah masuk dan akan segera diproses. Terimakasih sudah menggunakan Novia.",
            status_code: 204
        })

    } catch (e) {
        console.log(e);
        return res.send('Model Error')
    }
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

function argMax(array) {
    return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

module.exports = router