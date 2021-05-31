const express = require('express')
const router = express.Router()
const tf = require('@tensorflow/tfjs-node')
const path = require('path')
const vocab = require('../vocab.json')
let model = null

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

router.get('/', async function (req, res, next) {
    try {
        if (!model) model = await tf.node.loadSavedModel(path.join(__dirname, '..', 'ml_model'))
        const input = textToSequence(req.query.input)
        const result = model.predict(tf.tensor(input))
        return res.json(await result.array())
    } catch (e) {

    }
})

module.exports = router