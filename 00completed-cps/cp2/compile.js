const path = require('path')
const fs = require('fs')
const solc = require('solc')

const contractName = 'Lottery'
const contractFileName = `${contractName}.sol`
const contractFilePath = path.join(__dirname, 'contracts', contractFileName)

const contractSourceCode = fs.readFileSync(contractFilePath, 'utf8')

var input = {
  language: 'Solidity',
  sources: {
    [contractFileName]: {
      content: contractSourceCode
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}

var output = JSON.parse(solc.compile(JSON.stringify(input)))
// `output` here contains the JSON output as specified in the documentation
// for (const innerContractName in output.contracts[contractFileName]) {
//   console.log(
//     innerContractName +
//       ': ' +
//       output.contracts[contractFileName][innerContractName].evm.bytecode.object
//   )
// }

// const contractByteCode =
//   output.contracts[contractFileName][contractName].evm.bytecode.object

const contractByteCode = output.contracts[contractFileName][contractName]

// if you want to compile and save the result and use saved results use the below
fs.writeFileSync(
  path.join(__dirname, 'compiled-output', 'output.json'),
  JSON.stringify(contractByteCode),
  {
    encoding: 'utf8'
  }
)
// if you want to compile and get result run time use the below
// module.exports = contractByteCode
