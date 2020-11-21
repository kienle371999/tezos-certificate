const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cli = require('./lib/cli')

require('dotenv').config({ path: require('find-config')('.env') })
const app = express()
const port = process.env.API_PORT || 7000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))

app.listen(port, function () {
    console.log(`Server is listened on port ${port}`)
})

app.post('/api/create-certificate-pdf', async (req, res) => {
    const data = req.body.data
    cli.init(data)
    await cli.generate()

    return res.status(200).send({ message: "Successfully create PDF" })
})
