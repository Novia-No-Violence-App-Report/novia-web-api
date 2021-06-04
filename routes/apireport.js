// Import dependencies
const express = require('express')
const router = express.Router()
const path = require('path')
const tf = require('@tensorflow/tfjs-node')
const vocab = require('../vocabulary/vocabulary.json')
let model = null

const Firestore = require('@google-cloud/firestore');

// Initialize Firestore
const db = new Firestore({
    projectId: 'research-station',
    keyFilename: 'service-account.json',
});

async function addReport() {
    const res = await db.collection('reports').add({
        importance: 'low',
        report: 'pada saat saya ingin berangkat ke kantor saya melihat ada kardus mencurigakan di depan rumah saya dan pada saat saya cek di dalam kardus tersbut ada seorang anak bayi dengan selembar surat',
        timestamp: timeStamp(),
        user_id: '9123112310293'
    });

    console.log('Added document with ID: ', res.id);
}

async function addReportWithVariables(report, userId, importance) {
    const res = await db.collection('reports').add({
        importance: importance,
        report: report,
        timestamp: timeStamp(),
        user_id: userId
    });

    console.log('Added document with ID: ', res.id);
}

// addReport()
function paddingArray(sequence, padding) {
    const insertPadding = padding - sequence.length;
    for (let i = 0; i < insertPadding; i++) {
        sequence.unshift(0);
    }
    return sequence;
}
// function for processing Machine Learning Model
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

function processOutput(output) {
    return output.reduce(function (result, current) {
        result.push(current[1]);
        // console.log(current)
        return result;
    }, []);
}

function argMax(array) {
    return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

router.get('/', async function (req, res, next) {
    try {
        const modelUrl = "https://storage.googleapis.com/novia_model/models/model.json"
        if (!model) model = await tf.loadLayersModel(modelUrl)
        const input = textToSequence(req.query.input)
        const result = await model.predict(tf.tensor2d(await input))
        const resultImportance = argMax(result.dataSync())

        console.log("\nRESULT")
        console.log(resultImportance + "\n")

        if (resultImportance === 0) {
            return res.json({
                report: req.query.input,
                importance: "low"
            })
        } else if (resultImportance === 1) {
            return res.json({
                report: req.query.input,
                importance: "high"
            })
        }
    } catch (e) {
        console.log(e);
        return res.send('Model Error')
    }
})

module.exports = router