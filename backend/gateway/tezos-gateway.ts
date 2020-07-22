import { StoreType,
        TezosParameterFormat,
        TezosNodeWriter,
        TezosWalletUtil } from 'conseiljs'
import fetch from 'node-fetch'
import * as fs from 'fs'

require('dotenv').config({ path: require('find-config')('.env') })
const tezosNode = process.env.TEZOS_NODE
const storage = '"Tezos Southeat Asia"'
const RPCEnpoint = process.env.RPC_ENDPOINT

class TezosGateway {

    public static getInstance() {
        return new TezosGateway()
    }

    public async generateKey() {
        const mnemonic = TezosWalletUtil.generateMnemonic()
        const generatedkey = await TezosWalletUtil.unlockIdentityWithMnemonic(mnemonic)
        
        return generatedkey
    }

    public async initAccount() {
        const faucetAccount = {
            "mnemonic": [
              "also",
              "settle",
              "host",
              "sun",
              "explain",
              "cool",
              "autumn",
              "tilt",
              "cherry",
              "extend",
              "jacket",
              "decline",
              "steel",
              "people",
              "debris"
            ],
            "secret": "9335e071421fbc865a2e413aa3b13cfcfc0d9a01",
            "pkh": "tz1LBLgFQczUrd1CAvRagKzNY8u2N36LZNSK",
            "password": "CI3IbeOVfo",
            "email": "okhrslvc.ygqpyaph@tezos.example.org"
        }
        const generatedKey = await TezosWalletUtil.unlockFundraiserIdentity(faucetAccount.mnemonic.join(' '), 
        faucetAccount.email, faucetAccount.password, faucetAccount.pkh)
        console.log("initAccount -> keyGenerated", generatedKey)

        return { 'key': generatedKey, 'secret': faucetAccount.secret } 
    }

    public async activateAccount() {
        const account = await this.initAccount()
        console.log(tezosNode)
        const accountDetail = await TezosNodeWriter.sendIdentityActivationOperation(tezosNode, account.key, account.secret)
        console.log("activateAccount -> accountDetail", accountDetail)

        return accountDetail
    }

    public async initContract() {
        const account = await this.initAccount()
        const contract = fs.readFileSync('./michelson/Code.tz', { encoding:'utf8', flag:'r' })

        const nodeResult = await TezosNodeWriter.sendContractOriginationOperation(tezosNode, 
        account.key, 0, undefined, 100000, '', 1000, 100000, contract, storage, TezosParameterFormat.Michelson)
        const groupid = nodeResult['operationGroupID'].replace(/\"/g, '').replace(/\n/, '') 
        console.log(`Injected operation group id ${groupid}`)
        return groupid
    }

    public async getContractHash() {
        const groupid = await this.initContract()
        const url = RPCEnpoint.concat(groupid)
        console.log("TezosInteraction -> initContract -> url", url)
        
        let response = await fetch(url)
        while (response.status == 404) {
            response = await fetch(url)
        }
        const transactionDetail = await response.json()
        console.log("getContractHash -> transactionDetail", transactionDetail)

        return transactionDetail
    }

    public async invokeContract() {
        const contractAddress = 'KT1HgsdV5qv78gdomfusKdrMcKJYV71DXZMs'
        const account = await this.initAccount()
    
        const result = await TezosNodeWriter.sendContractInvocationOperation(tezosNode, account.key, contractAddress, 
        10000, 100000, '', 1000, 100000, '', '{"string": "Cryptonomicon"}', TezosParameterFormat.Micheline)
        console.log(result.operationGroupID)
    }

    public readFile() {
        const content = fs.readFileSync('./michelson/Code.tz', { encoding:'utf8', flag:'r' })
        console.log("readFile -> content", content)
    }

    public async signData(privateKey, data) {
        const keyStore = await TezosWalletUtil.restoreIdentityWithSecretKey(privateKey)
        const signature = await TezosWalletUtil.signText(keyStore, data)

        return signature
    }

    public async authenticateData(signature, data, publicKey) {
        const authentication = await TezosWalletUtil.checkSignature(signature, data, publicKey)
        console.log("authenticateData -> authentication", authentication)

        return authentication
    }
}

export default TezosGateway