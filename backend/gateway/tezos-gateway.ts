import { StoreType,
        TezosParameterFormat,
        TezosNodeWriter } from 'conseiljs'
import fetch from 'node-fetch'
import * as fs from 'fs'


const tezosNode = 'https://tezos-dev.cryptonomic-infra.tech:443'
const keystore = {
    publicKey: 'edpkvXW1PW4mCPoz9qgBqEfuBbNSMM2MBX7pUxbDA2uuh7grTby4GF',
    privateKey: 'edskS81rrkaDht2w9sfR8fxhQHcHg15vmXHuJhGsqCuF5jGB3jGiXpo2NbGrG6CkkBUbjekxdPX6PwaSxhJBJkpcHYHRPLyXGc',
    publicKeyHash: 'tz1ZEVp2TWctE8Da26ipgMY314BYDRYY6rQW',
    seed: '',
    storeType: StoreType.Fundraiser
}
const storage = '"Tezos Southeat Asia"'
const RPCEnpoint = 'https://api.carthagenet.tzstats.com/explorer/op/'


class TezosGateway {
    public async initContract() {
        const contract = fs.readFileSync('./michelson/Code.tz', { encoding:'utf8', flag:'r' })

        const nodeResult = await TezosNodeWriter.sendContractOriginationOperation(tezosNode, 
            keystore, 0, undefined, 100000, '', 1000, 100000, contract, storage, TezosParameterFormat.Michelson)
        const groupid = nodeResult['operationGroupID'].replace(/\"/g, '').replace(/\n/, '') 
        console.log(`Injected operation group id ${groupid}`)
        return groupid
    }

    public async getContractHash() {
        const groupid:string = await this.initContract()
        const url:string = RPCEnpoint.concat(groupid)
        console.log("TezosInteraction -> initContract -> url", url)
        
        let response = await fetch(url)
        while (response.status == 404) {
            response = await fetch(url)
        }
        const json = await response.json()
        console.log(json)
    }

    public async invokeContract() {
        const contractAddress = 'KT1HgsdV5qv78gdomfusKdrMcKJYV71DXZMs'
    
        const result = await TezosNodeWriter.sendContractInvocationOperation(tezosNode, keystore, contractAddress, 
        10000, 100000, '', 1000, 100000, '', '{"string": "Cryptonomicon"}', TezosParameterFormat.Micheline)
        console.log(result.operationGroupID)
    }

    public readFile() {
        const content = fs.readFileSync('./michelson/Code.tz', { encoding:'utf8', flag:'r' })
        console.log("readFile -> content", content)
    }
}


const tezos = new TezosGateway()
tezos.readFile()

//export default TezosGateway