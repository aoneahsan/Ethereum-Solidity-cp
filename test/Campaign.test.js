const assert = require('assert')
const ganache = require('ganache-cli')
const { request } = require('http')
const Web3Class = require('web3')
const { abi: CompaignABI } = require('./../compiled-output/Compaign.json')
const {
  abi: CompaignFactorABI,
  evm: {
    bytecode: { object: CompaignFactorBytecode }
  }
} = require('./../compiled-output/CompaignFactor.json')
const web3ObjInstance = new Web3Class(ganache.provider())

let accounts, factory, compaign, compaignAddress, factoryAddress
// beforeEach to get available accounts before each it statement
beforeEach(async () => {
  accounts = await web3ObjInstance.eth.getAccounts()

  factory = await new web3ObjInstance.eth.Contract(CompaignFactorABI)
    .deploy({
      data: CompaignFactorBytecode
    })
    .send({ from: accounts[0], gas: '1000000' })
  factoryAddress = factory.options.address
  await factory.methods.createCompaign('100').send({
    from: accounts[0],
    gas: '1000000'
  })
  ;[compaignAddress] = await factory.methods.getDeployedContracts().call()
  compaign = await new web3ObjInstance.eth.Contract(
    CompaignABI,
    compaignAddress
  )
})

// create a test group
describe('Campaign & CompaignFactor Contract Tests', () => {
  // it test for deploying the contract
  it('deploy the contract', () => {
    assert.ok(factoryAddress)
    assert.ok(compaignAddress)
  })

  // marks caller as compaign manager
  it('marks caller as compaign manager', async () => {
    try {
      const m = await compaign.methods.manager().call()
      assert.equal(m, accounts[0])
    } catch (error) {
      console.error(error)
      assert(false, 'From Catch block check test code.')
    }
  })

  // allow people to contribute money and mark as approvers
  it('allow people to contribute money and mark as approvers', async () => {
    try {
      await compaign.methods.contribute().send({
        from: accounts[1],
        value: '200'
      })
      const isContrubutor = await compaign.methods.approvers(accounts[1]).call()
      assert(isContrubutor)
    } catch (error) {
      console.error(error)
      assert(false, 'From Catch block check test code.')
    }
  })

  // need minimum account to contribute
  it('need minimum account to contribute', async () => {
    try {
      await compaign.methods.contribute().send({
        from: accounts[1],
        value: '2'
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  // allow compaign manager to make payment request
  it('allow compaign manager to make payment request', async () => {
    try {
      const description = 'payment request'
      const value = '10000'
      await compaign.methods
        .createRequest(description, value, accounts[2])
        .send({
          from: accounts[0],
          gas: '1000000'
        })
      requestIndex = await compaign.methods.numRequests().call()
      request = await compaign.methods.requests(requestIndex).call()
      console.log({ requestIndex, request })
      assert.equal(request.description, description)
      assert.equal(request.value, value)
      assert.equal(request.recipient, accounts[2])
      assert(!request.complete)
    } catch (error) {
      assert(false, 'From Catch block check test code.')
    }
  })
})
