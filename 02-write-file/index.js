const filesystem = require('fs')
const path = require('path')
const {stdin: input, stdout: output} = require('node:process')
const readline = require('node:readline')


const createAndOpenFileInCurrentFolder = (filename, callback) => {
    const fullPath = path.join(__dirname, filename)

    filesystem.open(fullPath, 'a', (error, descriptor) => {
        if (error) {
            console.error('Error', error)
            return
        }

        callback(fullPath)
    })
}


const writeToFile = (filepath, data) => {
    filesystem.appendFile(filepath, data,  error => {
        if (error) throw error
        //console.log('Saved!')
    })
}


const inputData = filepath => {
    const readInput = readline.createInterface({input, output})
    readInput.question('', answer => {
        //console.log(answer)
        readInput.close()
        if (answer.trim() === 'exit') {
            console.log('Thank you ! Goodbye !')
            return
        }
        writeToFile(filepath, answer)

        inputData(filepath)
    })
}


const main = () => {
    const FILENAME = 'test.txt'

    createAndOpenFileInCurrentFolder(FILENAME, inputData)
}

main()
