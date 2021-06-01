require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const cors = require('cors')

// Routes
const indexRouter = require('./routes/api')
const adminRouter = require('./routes/admin')

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({
    extended: true
}))
app.use(logger('dev'))
app.use(express.static('public'))
app.use(express.json())
app.use(cors())
app.use(express.static(__dirname + '/static'));
app.use('/api/report', indexRouter)
app.use('/admin', adminRouter)
app.listen(process.env.PORT || 8080)