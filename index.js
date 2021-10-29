require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const cors = require('cors')

// Routes
const apiReportRouter = require('./routes/apireport')
const apiUserRouter = require('./routes/apiuser')
const newsRouter = require('./routes/apinews')
const adminRouter = require('./routes/admin')
const homeRouter = require('./routes/home')

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

app.use('/api/report', apiReportRouter)
app.use('/api/user', apiUserRouter)
app.use('/admin', adminRouter)
app.use('/api/news', newsRouter)
app.use('/', homeRouter)

app.listen(process.env.PORT || 8080)
