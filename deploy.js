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
    // const contracts = [CompaignFactorCompiledContract] // we don't need to deploy the compaign contract as we will use factory contract to later deploy compaigns
    // for (let i = 0; i < contracts.length; i++) {
    const {
      abi: interface,
      evm: {
        bytecode: { object: bytecode }
      }
    } = CompaignFactorCompiledContract
    const accounts = await web3ObjInstance.eth.getAccounts()
    const result = await new web3ObjInstance.eth.Contract(interface)
      .deploy({
        data: bytecode
      })
      .send({ gas: '10000000', from: accounts[0] })
    const contractAddress = result.options.address
    console.log('interface S...')
    console.log(interface)
    console.log('interface E...')

    console.log('contractAddress S...')
    console.log({ contractAddress })
    console.log('contractAddress E...')
    const dataToStore = {
      interface,
      bytecode,
      contractAddress
    }

    fs.ensureDirSync(path.resolve(__dirname, `./deployed-contracts`))

    fs.outputJSONSync(
      path.resolve(
        __dirname,
        `./deployed-contracts/deployment-output-${new Date().toISOString()}.json`
      ),
      dataToStore
    )
    // }
  } catch (error) {
    console.error('Error in deploy.js Start----')
    console.log(error)
    console.error('Error in deploy.js End--')
  }
}
deployContract()
