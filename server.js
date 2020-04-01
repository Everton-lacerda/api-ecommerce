const compression = require('compression')
const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

// Start aplication 
const app = express()

// environment
const isProduction = process.env.NODE_ENV  === 'production'
const PORT = process.env.PORT || 3000

// static file
app.use('/public', express.static(__dirname + '/public'))
app.use('/public/images', express.static(__dirname + '/public/images'))


// Mongodb
const dbs = require('./config/database')
const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest

mongoose.connect(dbURI, { useNewUrlParser: true } )

// EJS
app.set('view engine', 'ejs')

// Config help
if(!isProduction) app.use(morgan('dev'))
app.use(cors())
app.disable('x-powered-by')
app.use(compression())

// Body Parser
app.use(express.urlencoded( {extended: true, limit: 1.5*1024*1024} ))
app.use(express.json({limit: 1.5*1024*1024}))

// Models
require('./models')

// Routes
app.use('/', require('./routes'))

// 404
app.use((req, res, next  ) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// 422, 500, 401 ...
app.use((err, req, res, next  ) => {
    res.status(err.status || 500)
    if(err.status !== 404) console.warn('Error: ', err.message, new Date())
    res.json({ erros: {message: err.message, status: err.status}})
})

// Listen
app.listen(PORT, (err) => {
    if(err) throw err
    console.log(`API Running in //localhost:${PORT}`)
})