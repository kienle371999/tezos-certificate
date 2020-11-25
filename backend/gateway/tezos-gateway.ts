import { TezosNodeWriter,
        TezosWalletUtil } from 'conseiljs'
import { TezosToolkit } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer'
        
import fetch from 'node-fetch'
import * as fs from 'fs'
import * as Handle from '../error/errorHandle'

require('dotenv').config({ path: require('find-config')('.env') })
const TezosNode = process.env.TEZOS_NODE
const ContractEnpoint = process.env.CONTRACT_ENDPOINT

const Tezos = new TezosToolkit(TezosNode)
const genericCode = require('../michelson/Code.tz.json')
        
class TezosGateway {
    public static getInstance() {
        return new TezosGateway()
    }

    public async generateKey() {
        try {
            const mnemonic = TezosWalletUtil.generateMnemonic()
            const generateKey = await TezosWalletUtil.unlockIdentityWithMnemonic(mnemonic, '')

            return Handle.Success(generateKey)
        }
        catch(error) {
            return Handle.ServerError(error.message)
        }
    }

    private async initAccount() {
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
        try {
            const account = await this.initAccount()
            const accountDetail = await TezosNodeWriter.sendIdentityActivationOperation(TezosNode, account.key, account.secret)
            console.log("activateAccount -> accountDetail", accountDetail)
    
            return Handle.Success(accountDetail)
        }
        catch(error) {
            return Handle.ServerError(error.message)
        }
    }

    public async initSmartCotract(privateKey, certificate) {
        try {
            Tezos.setProvider({ rpc: TezosNode, signer: new InMemorySigner(privateKey)})
            const storage = `{ Elt "Credential Number" "${certificate.credential_number}"; 
            Elt "Diploma Type" "${certificate.diploma_type}"; 
            Elt "Identity" "${certificate.identity}"; 
            Elt "Name" "${certificate.name}"; 
            Elt "Signature" "${certificate.signature}" }`
            console.log("TezosGateway -> initSmartCotract -> storage", storage)
    
            const confirmedContract = await Tezos.contract.originate({
                code: genericCode,
                init: storage
            })
            
            const contract = await confirmedContract.contract()
            console.log("deploy -> contract", contract.address)  
    
            return Handle.Success({ contractHash: contract.address })
        }
        catch(error) {
            return Handle.ServerError(error.message)
        }
    }

    public async getContractDetail(contractAddress) {
        try {
            const response = await fetch(ContractEnpoint.concat(`${contractAddress}/storage`))
            if(response.status === 400) {
                return Handle.BadRequest(`Can not find ${contractAddress} contract address`)
            }
            const detail = await response.json()
            console.log("TezosGateway -> getContractDetail -> detail", detail)
            return Handle.Success(detail)
        }
        catch(error) {
            return Handle.ServerError(error)
        }
    }

    public async signData(privateKey, data) {
        try {
            const keyStore = await TezosWalletUtil.restoreIdentityWithSecretKey(privateKey)
            const signature = await TezosWalletUtil.signText(keyStore, data)
            console.log("TezosGateway -> signData -> signature", signature)

            return Handle.Success(signature)
        }
        catch(error) {
            return Handle.ServerError(error.message)
        }
    }

    public async authenticateData(signature, data, publicKey) {
        try {
            const authentication = await TezosWalletUtil.checkSignature(signature, data, publicKey)
            console.log("authenticateData -> authentication", authentication)
            
            return Handle.Success({ 'result': authentication })
        }
        catch(error) {
            return Handle.ServerError(error.message)
        }
    }

    private readFile() {
        const content = fs.readFileSync('./michelson/Code.tz', { encoding:'utf8', flag:'r' })
        return content
    }
}

export default TezosGateway