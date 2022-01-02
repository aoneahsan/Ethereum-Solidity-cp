import web3 from './web3'
import CompaignFactoryContract from './compiled-contracts/CompaignFactor.json'

const { abi } = CompaignFactoryContract

const factoryDeployedAddress = [
  '0xCfE15e508BA8f259f7Ba1C25F9B49DE0897e2a04',
  '0x98F55E52bF1d2Ee8A86B52608104e4689d039234'
]

const CompaignFactoryContractAddress =
  factoryDeployedAddress[factoryDeployedAddress.length - 1]

const factory = new web3.eth.Contract(abi, CompaignFactoryContractAddress)

export default factory
