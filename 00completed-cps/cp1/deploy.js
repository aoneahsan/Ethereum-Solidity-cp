const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3Class = require('web3')
const {
  abi: interface,
  evm: {
    bytecode: { object: bytecode }
  }
} = require('./compiled-output/output.json')
const { storeInFile } = require('./utils/lib')
const { mnemonic, rinkebyInfuraUrl } = require('./.keys')

const providerOptions = new HDWalletProvider({
  mnemonic,
  url: rinkebyInfuraUrl
})

const web3ObjInstance = new Web3Class(providerOptions)

const deployContract = async () => {
  try {
    const accounts = await web3ObjInstance.eth.getAccounts()
  const result = await new web3ObjInstance.eth.Contract(interface)
    .deploy({
      data: bytecode,
      arguments: ['Hi there!']
    })
    .send({ gas: '10000000', from: accounts[0] })

  storeInFile(result, res => {
    if (res) {
      const contractAddress = result.options.address
      console.log('Contract Deployed Successfully, Address: ', contractAddress)
    } else {
      console.error('Error Occured while deploying contract.')
    }
  })
  } catch (error) {
    console.error('Error in deploy.js Start----')
    console.log(error)
    console.error('Error in deploy.js End--')
  }
}
deployContract()
