import Web3 from 'web3'

const provider = new Web3.providers.HttpProvider(
  'https://rinkeby.infura.io/v3/f1a0b416f0724ef883bcbfdb741e90ab'
)

let web3Instance = new Web3(provider)
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and Metamask is running
  // web3Instance = new Web3(window.web3.currentProvider)
  // web3Instance = new Web3(window.web3.currentProvider.enable())
  // web3Instance = new Web3(window.ethereum.enable())
  web3Instance = new Web3(window.ethereum)
} else {
  web3Instance = new Web3(provider)
}

export default web3Instance
