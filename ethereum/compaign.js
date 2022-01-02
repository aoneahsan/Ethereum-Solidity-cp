import web3 from './web3'
import CompaignContract from './compiled-contracts/Compaign.json'

const { abi } = CompaignContract

export default address => {
  return new web3.eth.Contract(abi, address)
}
