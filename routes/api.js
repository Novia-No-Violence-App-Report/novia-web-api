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
        type: 'kekerasan',
        report: 'pada saat saya ingin berangkat ke kantor saya melihat ada kardus mencurigakan di depan rumah saya dan pada saat saya cek di dalam kardus tersbut ada seorang anak bayi dengan selembar surat',
        timestamp: timeStamp(),
        user_id: '9123112310293'
    });

    console.log('Added document with ID: ', res.id);
}
// addReport()
function paddingArray(sequence, padding) {
    const insertPadding = padding - sequence.length;
    for (let i = 0; i < insertPadding; i++) {
        sequence.push(0);
    }
    return sequence;
}
// function for processing Machine Learning Model
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
        finalResult.push(paddingArray(sequence, 53))
        return finalResult
    }, [])
}

function processOutput(output) {
    return output.reduce(function (result, current) {
        result.push(current[0]);
        return result;
    }, []);
}

router.get('/', async function (req, res, next) {
    try {
        // if (!model) model = await tf.node.loadSavedModel(path.join(__dirname, '..', 'novia_model', 'my_model'))
        const modelUrl = "https://storage.googleapis.com/novia_model/models/model.json"
        if (!model) model = await tf.loadLayersModel(modelUrl)
        const input = textToSequence(req.query.input)
        const result = model.predict(tf.tensor2(input))
        if (tf.argMax(result) == 0) {
            let importance = "Low";
            console.log(importance);
          } 
        else if (tf.argMax(result) == 1){
            // console.log("High\n");
            let importance = "High";
            console.log(importance);
          }
        return res.json(processOutput(await result.array()))
    } catch (e) {
        console.log(e);
        return res.send('Model Error')
    }
})

module.exports = router