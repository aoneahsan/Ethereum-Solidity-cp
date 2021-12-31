import Web3 from 'web3'

const provider = new Web3.providers.HttpProvider(
  'https://rinkeby.infura.io/v3/f1a0b416f0724ef883bcbfdb741e90ab'
)

const web3Instance = new Web3(provider)

export default web3Instance
