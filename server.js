const  express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const httpServer = require('http-server')
const history = require('connect-history-api-fallback')

const app = express()
const port = process.env.PORT || 7000

app.use(express.static(__dirname + '/frontend/dist'))
app.use(history({
    disableDotRule: true,
    verbose: true
}))
app.use(express.static(__dirname + '/frontend/dist'))

app.listen(port, function() {
    console.log(`Server is listened on port ${port}`)
})