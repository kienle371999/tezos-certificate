import * as express from 'express'
import * as cors from 'cors'
import TezosGateway from './gateway/tezos-gateway'

require('dotenv').config({ path: require('find-config')('.env') })
const app = express()
const host = process.env.API_PORT

app.use(cors())

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
