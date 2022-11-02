const filesystem = require('fs')


const printFileContent = filename => {
    const readStream = filesystem.createReadStream(__dirname + `/${filename}`, 'utf8')

    readStream.on('data', data => console.log(data))
    readStream.on('error', error => console.log(error.message))
}

const main = () => {
    const FILENAME = 'text.txt'

    printFileContent(FILENAME)
}


main()
