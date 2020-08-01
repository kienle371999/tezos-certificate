import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import TezosGateway from './gateway/tezos-gateway'

require('dotenv').config({ path: require('find-config')('.env') })
const app = express()
const host = process.env.API_PORT

app.use(cors())
app.use(bodyParser())

app.listen(host, function() {
    console.log(`Server is listened on port ${host}`)
})

app.get('/api/init-account', async function(req, res) {
    const result = await TezosGateway.getInstance().generateKey()
    return res.send(result)
})

app.get('/api/active-account', async function(req, res) {
    const result = await TezosGateway.getInstance().activateAccount()
    return res.send(result)
})

app.post('/api/sign-data', async function(req, res) {
    const privateKey = req.body.privateKey
    const data = req.body.data
    const result = await TezosGateway.getInstance().signData(privateKey, data)
    return res.send(result)
})

app.post('/api/authenticate-data', async function(req, res) {
    const signature = req.body.signature
    const data = req.body.data
    const publicKey = req.body.publicKey
    const result = await TezosGateway.getInstance().authenticateData(signature, data, publicKey)
    return res.send(result)
})
, 
app.post('/api/broadcast-certificate', async function(req, res) {
    const privateKey = req.body.privateKey
    const certificate = req.body.certificate
    const result = await TezosGateway.getInstance().getContractHash(privateKey, certificate)
    return res.send(result)
})

