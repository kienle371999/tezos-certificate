import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import TezosGateway from './gateway/tezos-gateway'
import * as jwt from 'jsonwebtoken'

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
const port = process.env.API_PORT
app.use(cors())
app.use(bodyParser.json())

app.listen(port, function() {
    console.log(`Server is listened on port ${port}`)
})

app.get('/api/init-account', authenJWT, async function(req, res) {
    const result = await TezosGateway.getInstance().generateKey()
    return res.status(result.code).json(result.data)
})

app.get('/api/active-account', authenJWT, async function(req, res) {
    const result = await TezosGateway.getInstance().activateAccount()
    return res.status(result.code).json(result.data)
})

app.post('/api/sign-data', authenJWT, async function(req, res) {
    const privateKey = req.body.privateKey
    const data = req.body.data
    const result = await TezosGateway.getInstance().signData(privateKey, data)
    return res.status(result.code).json(result.data)
})

app.post('/api/authenticate-data', authenJWT, async function(req, res) {
    const signature = req.body.signature
    const data = req.body.data
    const publicKey = req.body.publicKey
    const result = await TezosGateway.getInstance().authenticateData(signature, data, publicKey)
    return res.status(result.code).json(result.data)
})
, 
app.post('/api/broadcast-certificate', authenJWT, async function(req, res) {
    const privateKey = req.body.privateKey
    const certificate = req.body.certificate
    const result = await TezosGateway.getInstance().initSmartCotract(privateKey, certificate)
    return res.status(result.code).json(result.data)
})

app.post('/api/get-contract-detail', authenJWT, async function(req, res) {
    const contractAddress = req.body.contractAddress
    console.log("contractAddress", contractAddress)
    const result = await TezosGateway.getInstance().getContractDetail(contractAddress)
    return res.status(result.code).json(result.data)
})


