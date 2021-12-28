const fs = require('fs')
const path = require('path')

const deployedContractsDirectoryPath = path.join(
  __dirname,
  '/../deployed-contracts'
)

const getFilePath = file => {
  return `${deployedContractsDirectoryPath}/${file}.json`
}

const dataLib = {}

// create function
dataLib.storeInFile = (data, callback) => {
  try {
    dataLib.list(dirDataList => {
      const filePath = getFilePath(`result${dirDataList.length + 1}`)
      fs.open(filePath, 'wx', (err, fileDiscriptor) => {
        if (err) {
          console.log(err, {
            message: 'Error Occured while opening the file.',
            error: err && err.toString(),
            errorStack: err && err.stack
          })
          callback(false)
        } else {
          const dataString = JSON.stringify(data)
          fs.writeFile(fileDiscriptor, dataString, null, err => {
            if (err) {
              console.log(err, {
                message: 'Error Occured while writing the file.',
                error: err && err.toString(),
                errorStack: err && err.stack
              })
              callback(false)
            } else {
              fs.close(fileDiscriptor, err => {
                if (err) {
                  console.log(err, {
                    message: 'Error Occured while closing the file.',
                    error: err && err.toString(),
                    errorStack: err && err.stack
                  })
                  callback(false)
                } else {
                  console.log(null, {
                    message: 'file created successfully.',
                    error: err && err.toString(),
                    errorStack: err && err.stack
                  })
                  callback(true)
                }
              })
            }
          })
        }
      })
    })
  } catch (error) {
    console.error('Error while creating file ', error)
    callback(false)
  }
}

// List
dataLib.list = callback => {
  try {
    fs.mkdir(dirPath, { recursive: true }, err => {
      if (err) {
        console.log(err, {
          message: 'Error occured while creating directory.',
          error: err && err.toString(),
          errorStack: err && err.stack
        })
        callback(false)
      } else {
        fs.readdir(dirPath, (err, dirFilesList) => {
          if (err) {
            console.log(err, {
              message: 'Error Occured while reading the directory.',
              error: err && err.toString(),
              errorStack: err && err.stack,
              dirFilesList
            })
            callback(false)
          } else if (!dirFilesList || dirFilesList.length <= 0) {
            console.log(new Error('no checks available'), {
              message: 'no checks available.',
              dirFilesList
            })
            callback(false)
          } else {
            const fielsData = dirFilesList.map(el => el.replace('.json', ''))
            callback(fielsData)
          }
        })
      }
    })
  } catch (error) {
    console.error('Error occured while reading directory ', error)
    callback(false)
  }
}

module.exports = dataLib
