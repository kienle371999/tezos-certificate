import smartpy as sp


class PhraseKeeper(sp.Contract):
    def __init__(self, initialPhrase):
        self.init(phrase = initialPhrase)
    @sp.entry_point
    def setPhrase(self, params):
        self.data.phrase = params

# We evaluate a contract with parameters.
contract = PhraseKeeper('Tezos')

# We need to compile the contract.
# It can be done with the following command.
import smartpybasic as spb
spb.compileContract(contract, targetBaseFilename = './michelson/')

print("Contract compiled in michelson")