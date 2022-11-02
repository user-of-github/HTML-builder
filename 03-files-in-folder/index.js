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
            console.dir(`${file.name} - ${path.extname(file.name).slice(1)} - ${await getFileSize(path.join(filePath, file.name))} bytes`)
        })
    })
}


const main = () => {
    const folder = 'secret-folder'
    const folderPath = path.join(__dirname, folder)
    getObjectsFromFolder(folderPath)
}


main()
