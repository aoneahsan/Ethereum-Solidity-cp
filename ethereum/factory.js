import web3 from './web3'
import { abi } from './compiled-contracts/CompaignFactor.json'

const CompaignFactoryContractAddress =
  '0xCfE15e508BA8f259f7Ba1C25F9B49DE0897e2a04'
const factory = new web3.eth.Contract(abi, CompaignFactoryContractAddress)

export default factory
