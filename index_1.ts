import { TezosToolkit } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer'

const Tezos = new TezosToolkit('https://tezos-dev.cryptonomic-infra.tech:443')


const signer = new InMemorySigner('edskRkJBxEKRYYQGtsMjNAjYJrCSGj1uSCPjpeM3KBQRHRRGnk7DvN2rphjCDCrEe9HS2dnifWuSvfEbpb9qWhN5wpbxv3t6TJ')
Tezos.setProvider({ rpc: 'https://tezos-dev.cryptonomic-infra.tech:443', signer: signer })

const genericCode = require('./backend/michelson/Code.tz.json')

async function deploy() {
   try {
        const res = await Tezos.contract.originate({
            code: genericCode,
            init: `{ Elt "Document Type" "Hello_VietNam";
            Elt "Identity" "hello" }`
        })
        console.log('ooooooooo', res.contractAddress)
        
        const contract = await res.contract()
        console.log("deploy -> contract", contract.address)  
    }
    catch(error) {
        console.log("error", error)
    }
}

deploy()