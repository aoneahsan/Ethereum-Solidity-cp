const path = require('path')
const fs = require('fs-extra')
const solc = require('solc')

const contractName = 'Campaign'
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

var output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[contractFileName]

for (const contract in output) {
  if (Object.hasOwnProperty.call(output, contract)) {
    fs.writeJSONSync(
      path.resolve(
        __dirname,
        `./compiled-output/${contract}.json`
      ),
      output[contract]
    )
  }
}
