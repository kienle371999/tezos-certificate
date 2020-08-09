const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cli = require('../lib/cli')

require('dotenv').config({ path: require('find-config')('.env') })
const app = express()
const port = process.env.API_PORT

app.use(cors)
app.use(bodyParser())

app.listen(port, function() {
    console.log(`Server is listened on port ${port}`)
})

app.post('/api/init-certificate-data', function(req, res) {
    const courseData = req.body.courseData
    cli.init(courseData)
    return res.send({ message: "Creating certificate's data" })
})

app.post('/api/create-certificate-pdf', async function(req, res) {
    await cli.generate()
    return res.setTimeout(2000, () => {
        res.send({ message: "Successfully generate PDF" })
    })
})

