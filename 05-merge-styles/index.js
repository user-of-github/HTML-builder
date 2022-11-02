const filesystem = require('fs')
const path = require('path')


const getFilesWithExtensionFromFolder = async (folderPath, extension) => {
    return await filesystem.promises.readdir(folderPath, {withFileTypes: true}).then(files => {
        const response = []
        files.forEach(async file => {
            if (!file.isFile()) return
            if (path.extname(file.name).slice(1) !== extension) return

            response.push(path.join(folderPath, file.name))
        })

        return response
    })
}


const readDataFromFiles = async (filesNames) => {
    const promises = filesNames.map(filename => new Promise((resolve, reject) => {
        filesystem.readFile(filename, 'utf8', (error, data) => {
            if (error) {
                console.log(error)
                reject(error)
                return
            }

            resolve(data.toString())
        })
    }))

    return await Promise.all(promises).then(result => result)
}


const writeToFile = (filepath, data) => {
    const writeStream = filesystem.createWriteStream(filepath, 'utf8');
    writeStream.write(data)
    writeStream.end();
}

const main = async () => {
    const sourceFolder = path.join(__dirname, 'styles')
    const sourceFiles = await getFilesWithExtensionFromFolder(sourceFolder, 'css')
    const dataFromFiles = (await readDataFromFiles(sourceFiles)).join('')


    const outputFile = path.join(__dirname, 'project-dist', 'bundle.css')

    writeToFile(outputFile, dataFromFiles)
}

main()
