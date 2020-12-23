const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cli = require('./lib/cli')
const jwt = require('jsonwebtoken')


require('dotenv').config({ path: require('find-config')('.env') })

const authenJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
      const token = authHeader.split(' ')[1]

      jwt.verify(token, process.env.ACCESS_KEY, (err, user) => {
          if (err) {
              return res.status(403).json({ error: 'Forbidden' })
          }
          next()
      })
  } else {
      res.status(403).json({ error: 'Unauthorized' })
  }
}

const app = express()
const port = process.env.API_PORT || 7000
app.use(cors())
app.use(bodyParser.json())

app.listen(port, function () {
    console.log(`Server is listened on port ${port}`)
})

app.post('/api/create-certificate-pdf', authenJWT, async (req, res) => {
    const data = req.body.data
    try {
      cli.init(data)
      await cli.generate()
      return res.status(200).json({ message: "Successfully create PDF" })
    }
    catch(error) {
      return res.status(400).json({ error: error.message })
    }
})

app.post('/api/send-mail-certificate', authenJWT, async (req, res) => {
    const params = req.body
    console.log("params", params)
    try {
      await cli.sendMailCertificate(params)
      return res.status(200).json({ message: "Successfully send email to beneficiary" })
    }
    catch(error) {
      return res.status(400).json({ error: error.message})
    }
})


