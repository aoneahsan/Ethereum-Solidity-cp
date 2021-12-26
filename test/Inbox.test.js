const assert = require('assert')
const ganache = require('ganache-cli')
const Web3Class = require('web3')
const {
  abi: interface,
  evm: {
    bytecode: { object: bytecode }
  }
} = require('./../compiled-output/output.json')
const web3ObjInstance = new Web3Class(ganache.provider())

const INITIAL_DEFAULT_MESSAGE = 'Hi there!'
let accounts, inboxContractRes
// beforeEach to get available accounts before each it statement
beforeEach(async () => {
  accounts = await web3ObjInstance.eth.getAccounts()

  inboxContractRes = await new web3ObjInstance.eth.Contract(interface)
    .deploy({
      data: bytecode,
      arguments: [INITIAL_DEFAULT_MESSAGE]
    })
    .send({ from: accounts[0], gas: '1000000' })
})

// create a test group
describe('Inbox Contract Tests', () => {
  // it test for deploying the contract
  it('deploy the contract', () => {
    assert.ok(inboxContractRes.options.address)
  })

  // it test for initial message check
  it('has initial default message', async () => {
    const message = await inboxContractRes.methods.message().call()
    assert.equal(message, INITIAL_DEFAULT_MESSAGE)
  })

  // it test for chaning the message check
  it('can change the message', async () => {
    const newMessage = 'bye'
    await inboxContractRes.methods
      .setMessage(newMessage)
      .send({ from: accounts[0] })
    const message = await inboxContractRes.methods.message().call()
    assert.equal(message, newMessage)
  })
})
