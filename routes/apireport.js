const express = require('express')
const router = express.Router()
// const tf = require('@tensorflow/tfjs-node')
const path = require('path')
// const vocab = require('../vocab.json')
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

function textToSequence(rawInput) {
    const input = Array.isArray(rawInput) ? rawInput : [rawInput]
    console.log(input)
    return input.reduce(function (finalResult, currentInput) {
        const words = currentInput.split(" ")
        console.log(words)
        const sequence = words.reduce(function (result, current) {
            if (vocab[current]) result.push(vocab[current])
            return result
        }, [])
        console.log(sequence)
        finalResult.push(sequence)
        return finalResult
    }, [])
}

router.post('/', async function (req, res, next) {

    try {
        console.log(req.body)
        let report = req.body.report
        let userId = req.body.user_id
        // 1 predict dulu
        let importance = "high"
        // 2 balikin response
        // 3 masukin ke firestore
        addReport(report, userId, importance)
        res.json({
            report: req.body,
            msg: "Laporan anda sudah masuk dan akan segera diproses. Terimakasih sudah menggunakan Novia.",
            status_code: 204
        })
    } catch {
        res.json({
            report: req.body,
            msg: "Laporan gagal diproses, mohon coba beberapa saat lagi.",
            status_code: 405
        })
    }
})

module.exports = router