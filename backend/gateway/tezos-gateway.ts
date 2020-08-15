import { StoreType,
        TezosParameterFormat,
        TezosNodeWriter,
        TezosWalletUtil } from 'conseiljs'
import fetch from 'node-fetch'
import * as fs from 'fs'

require('dotenv').config({ path: require('find-config')('.env') })
const tezosNode = process.env.TEZOS_NODE
const RPCEnpoint = process.env.RPC_ENDPOINT
const ContractEnpoint = process.env.CONTRACT_ENDPOINT

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
        const accountDetail = await TezosNodeWriter.sendIdentityActivationOperation(tezosNode, account.key, account.secret)
        console.log("activateAccount -> accountDetail", accountDetail)

        return accountDetail
    }

    public async initContract(privateKey, certificate) {
        console.log("TezosGateway -> initContract -> certificate", certificate)
        
        const storage = `{ Elt "Credential Number" "${certificate.credential_number}"; 
        Elt "Diploma Type" "${certificate.diploma_type}"; 
        Elt "Identity" "${certificate.identity}"; Elt "Name" "${certificate.name}"; 
        Elt "Signature" "${certificate.signature}" }`
        
        console.log("TezosGateway -> initContract -> storage", storage)
        const contract = this.readFile()
        console.log("TezosGateway -> initContract -> contract", contract)
        
        const keyStore = await TezosWalletUtil.restoreIdentityWithSecretKey(privateKey)
        console.log("TezosGateway -> initContract -> keyStore", keyStore)

        const nodeResult = await TezosNodeWriter.sendContractOriginationOperation(tezosNode, 
        keyStore, 0, undefined, 100000, '', 1000, 100000, contract, storage, TezosParameterFormat.Michelson)
        const groupid = nodeResult['operationGroupID'].replace(/\"/g, '').replace(/\n/, '') 
        console.log(`Injected operation group id ${groupid}`)
        return groupid
    }

    public async getContractHash(privateKey, certificate) {
        const groupid = await this.initContract(privateKey, certificate)
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
        10000, 1000000, '', 1000, 100000, '', '{"string": "Cryptonomicon"}', TezosParameterFormat.Micheline)
        console.log(result.operationGroupID)
    }

    public async getContractDetail(contractAddress) {
        const url = ContractEnpoint.concat(`${contractAddress}/storage`)
        console.log("TezosGateway -> getContractDetail -> url", url)
        const response = await fetch(url)
        const contractDetail = response.json()
        console.log("TezosGateway -> contractDetail", contractDetail)

        return contractDetail
    }

    public readFile() {
        const content = fs.readFileSync('./michelson/Code.tz', { encoding:'utf8', flag:'r' })
        return content
    }

    public async signData(privateKey, data) {
        const keyStore = await TezosWalletUtil.restoreIdentityWithSecretKey(privateKey)
        const signature = await TezosWalletUtil.signText(keyStore, data)
        console.log("TezosGateway -> signData -> signature", signature)

        return signature
    }

    public async authenticateData(signature, data, publicKey) {
        try {
            const authentication = await TezosWalletUtil.checkSignature(signature, data, publicKey)
            console.log("authenticateData -> authentication", authentication)
            return { 'result': authentication }
        }
        catch(err) {
            console.log("TezosGateway -> authenticateData -> err", err)
        }
    }
}

export default TezosGateway