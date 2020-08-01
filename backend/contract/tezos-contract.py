import smartpy as sp


class PhraseKeeper(sp.Contract):
    def __init__(self, initialPhrase):
        self.init(phrase = initialPhrase)

# We evaluate a contract with parameters.
contract = PhraseKeeper({ "Name": "John",
"Identity": "17021234",
"Diploma Type": "Computer Science",
"Credential Number": "UET1234",
"Signature": "sign" })

# We need to compile the contract.
# It can be done with the following command.
import smartpybasic as spb
spb.compileContract(contract, targetBaseFilename = './backend/michelson/')

print("Contract compiled in michelson")