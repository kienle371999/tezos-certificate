const  express = require('express')
const path = require('path')
const serveStatic = require('serve-static')

const app = express()
const port = process.env.PORT || 8080

app.use(serveStatic(__dirname + '/dist'))
app.listen(port, function() {
    console.log(`Server is listened on port ${port}`)
})