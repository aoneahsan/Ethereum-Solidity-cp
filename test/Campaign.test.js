const assert = require('assert')
const ganache = require('ganache-cli')
const Web3Class = require('web3')
const {
  abi,
  evm: {
    bytecode: { object: bytecode }
  }
} = require('./../compiled-output/output.json')
const web3ObjInstance = new Web3Class(ganache.provider())

let accounts, deployedContractRes, deployedContractAddress
// beforeEach to get available accounts before each it statement
beforeEach(async () => {
  accounts = await web3ObjInstance.eth.getAccounts()

  deployedContractRes = await new web3ObjInstance.eth.Contract(abi)
    .deploy({
      data: bytecode
    })
    .send({ from: accounts[0], gas: '1000000' })
  deployedContractAddress = deployedContractRes.options.address
})

// create a test group
describe('Campaign Contract Tests', () => {
  // it test for deploying the contract
  it('deploy the contract', () => {
    assert.ok(deployedContractAddress)
  })

  // allow one account to enter
  it('allow one account to enter', async () => {
    try {
      await deployedContractRes.methods.enter().send({
        from: accounts[0],
        value: web3ObjInstance.utils.toWei('0.02', 'ether')
      })

      const players = await deployedContractRes.methods.getPlayers().call()

      assert.ok(players[0])
      assert.equal(players[0], accounts[0])
    } catch (error) {
      console.error(error)
      assert(false, 'From Catch block check test code.')
    }
  })

  // allow multiple accounts to enter
  it('allow multiple accounts to enter', async () => {
    try {
      await deployedContractRes.methods.enter().send({
        from: accounts[0],
        value: web3ObjInstance.utils.toWei('0.02', 'ether')
      })
      await deployedContractRes.methods.enter().send({
        from: accounts[1],
        value: web3ObjInstance.utils.toWei('0.02', 'ether')
      })
      await deployedContractRes.methods.enter().send({
        from: accounts[2],
        value: web3ObjInstance.utils.toWei('0.02', 'ether')
      })

      const players = await deployedContractRes.methods.getPlayers().call()

      assert.ok(players[0])
      assert.equal(players[0], accounts[0])
      assert.ok(players[1])
      assert.equal(players[1], accounts[1])
      assert.ok(players[2])
      assert.equal(players[2], accounts[2])
    } catch (error) {
      console.error(error)
      assert(false, 'From Catch block check test code.')
    }
  })

  // requires a minimum account to enter (> .01 ether)
  it('requires a minimum account to enter (> .01 ether)', async () => {
    try {
      await deployedContractRes.methods.enter().send({
        from: accounts[0],
        value: web3ObjInstance.utils.toWei('0.01', 'ether')
      })

      const players = await deployedContractRes.methods.getPlayers().call()

      assert.ok(players[0])
      assert.equal(players[0], accounts[0])
    } catch (error) {
      // console.error(error)
      assert(error, 'Error if try to enter with less than .01 ether.')
    }
  })

  // only manager can call pickwiner
  it('only manager can call pickwiner', async () => {
    try {
      await deployedContractRes.methods.pickWinner().send({
        from: accounts[1]
      })
      assert(false, 'was able to call pickWinner from a non-manager account.')
    } catch (error) {
      assert(error)
    }
  })

  // send money to winner on pickWinner call
  it('send money to winner on pickWinner call', async () => {
    try {
      let players = await deployedContractRes.methods.getPlayers().call()
      assert.ok(players.length === 0)

      let lotteryBalance = await web3ObjInstance.eth.getBalance(
        deployedContractAddress
      )
      assert.equal(lotteryBalance, 0)

      await deployedContractRes.methods.enter().send({
        from: accounts[0],
        value: web3ObjInstance.utils.toWei('1', 'ether')
      })

      lotteryBalance = await web3ObjInstance.eth.getBalance(
        deployedContractAddress
      )
      assert.ok(lotteryBalance > 0)

      players = null
      players = await deployedContractRes.methods.getPlayers().call()
      assert.ok(players.length >= 1)

      assert.ok(players[0])
      assert.equal(players[0], accounts[0])

      await deployedContractRes.methods.pickWinner().send({
        from: accounts[0]
      })

      lotteryBalance = await web3ObjInstance.eth.getBalance(
        deployedContractAddress
      )
      assert.ok(lotteryBalance == 0)
    } catch (error) {
      console.error(error)
      assert(false, 'From Catch block check test code.')
    }
  })
})
