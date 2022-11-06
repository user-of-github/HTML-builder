const filesystem = require('fs')
const path = require('path')


const getFileSize = async name => {
    return await new Promise((resolve, reject) => filesystem.stat(name, (err, {size}) => {
        if (err) return reject(err)
        resolve(size)
    })).then(data => Number(data))
}

const getObjectsFromFolder = filePath => {
    filesystem.readdir(filePath, {withFileTypes: true}, (err, files) => {
        if (err) {
            console.log(err)
            return
        }

        files.forEach(async file => {
            if (!file.isFile()) return
            const extension = path.extname(file.name).slice(1)
            const name = path.parse('/' + file.name).name
            const size = await getFileSize(path.join(filePath, file.name))

            console.log(`${name} - ${extension} - ${size} bytes`)
        })
    })
}


const main = () => {
    const folder = 'secret-folder'
    const folderPath = path.join(__dirname, folder)
    getObjectsFromFolder(folderPath)
}


main()
