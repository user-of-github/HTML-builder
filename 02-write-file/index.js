const filesystem = require('fs')
const path = require('path')
const {stdin: input, stdout: output} = require('node:process')
const readline = require('node:readline')


console.log('Hi ! Please enter some text and press ENTER\nTo quit type "exit" or press CTRL+C\n')

const GOODBYE_MESSAGE = 'Thanks. Goodbye !'

process.openStdin().on('keypress',  (_, key) => {
    if (key && key.name === 'c' && key.ctrl) {
        console.log(GOODBYE_MESSAGE)
        process.exit()
    }
})

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
    })
}


const inputData = filepath => {
    const readInput = readline.createInterface({input, output})
    readInput.question('', answer => {
        //console.log(answer)
        readInput.close()
        if (answer.trim() === 'exit') {
            console.log(GOODBYE_MESSAGE)
            return
        }
        writeToFile(filepath, answer)

        inputData(filepath)
    })
}


const main = () => {
    const FILENAME = 'test-output.txt'

    createAndOpenFileInCurrentFolder(FILENAME, inputData)
}

main()
