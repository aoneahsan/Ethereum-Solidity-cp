const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3Class = require('web3')
const path = require('path')
const fs = require('fs-extra')
const CompaignCompiledContract = require('./compiled-output/Compaign.json')
const CompaignFactorCompiledContract = require('./compiled-output/CompaignFactor.json')
const { mnemonic, rinkebyInfuraUrl } = require('./.keys')

const providerOptions = new HDWalletProvider({
  mnemonic,
  url: rinkebyInfuraUrl
})

const web3ObjInstance = new Web3Class(providerOptions)

const deployContract = async () => {
  try {
    // const contracts = [CompaignCompiledContract, CompaignFactorCompiledContract]
    const contracts = [CompaignFactorCompiledContract] // we don't need to deploy the compaign contract as we will use factory contract to later deploy compaigns
    for (let i = 0; i < contracts.length; i++) {
      const {
        abi: interface,
        evm: {
          bytecode: { object: bytecode }
        }
      } = contracts[i]
      const accounts = await web3ObjInstance.eth.getAccounts()
      const result = await new web3ObjInstance.eth.Contract(interface)
        .deploy({
          data: bytecode
        })
        .send({ gas: '10000000', from: accounts[0] })
      const contractAddress = result.options.address
      console.log('interface S...', i)
      console.log(interface)
      console.log('interface E...', i)

      console.log('contractAddress S...', i)
      console.log({ contractAddress })
      console.log('contractAddress E...', i)
      const dataToStore = {
        interface,
        bytecode,
        contractAddress
      }

      fs.writeJSONSync(
        path.resolve(
          __dirname,
          `./deployed-contracts/deployment-output-${new Date().toLocaleDateString()}.json`
        ),
        dataToStore
      )
    }
  } catch (error) {
    console.error('Error in deploy.js Start----')
    console.log(error)
    console.error('Error in deploy.js End--')
  }
}
deployContract()
