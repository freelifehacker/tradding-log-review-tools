const pkg = require('./package')
const config = require('./config/db')
const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const index = require('./router/index')
const movie = require('./router/movie')
const pdf = require('./router/pdf')
const news = require('./router/news')
const traddingitems = require('./router/traddingitems')
const traddingdate = require('./router/traddingdate')

mongoose.connect(config.mongodb)
mongoose.Promise = global.Promise

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(favicon(__dirname + '/src/assets/favicon.ico'))
app.use(express.static('dist'))
app.use('/',index)
app.use('/api/movie',movie)
app.use('/api/pdf',pdf)
app.use('/api/traddingitems',traddingitems)
app.use('/api/traddingdate',traddingdate)
app.use('/api/news',news)

app.listen(port, () => {
  console.log(`${pkg.name} listening on port ${port}`)
})

module.exports = app
