const fs = require('fs')
const path = require('path')
const filesystem = require('fs')


const copyFolder = async (srcDir, dstDir) => {
    const files = await fs.promises.readdir(srcDir).then(data => data)

    const promises = files.map(file => new Promise(async (resolve, reject) => {
        const src = srcDir + '/' + file
        const dst = dstDir + '/' + file

        const stat = await fs.promises.stat(src)

        if (stat && stat.isDirectory()) {
            try {
                await fs.promises.mkdir(dst)
            } catch (e) {
                console.log('error: ', e)
            }

            await copyFolder(src, dst)

            resolve()
        } else {
            try {
                await fs.promises.writeFile(dst, await fs.promises.readFile(src))
            } catch (e) {
                console.log('error: ', e)
            }

            resolve()
        }

    }))

    return await Promise.all(promises).then(result => result)
}

///////////////////// CSS
const getFilesWithExtensionFromFolder = async (folderPath, extension) => {
    return await fs.promises.readdir(folderPath, {withFileTypes: true}).then(files => {
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
        fs.readFile(filename, 'utf8', (error, data) => {
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
    const writeStream = fs.createWriteStream(filepath, 'utf8');
    writeStream.write(data)
    writeStream.end()
}

const readComponent = async (filepath) => {
    if (path.extname(filepath) !== '.html') return ''
    return await fs.promises.readFile(filepath, 'utf8')
}


const main = async () => {
    const destinationFolder = path.join(__dirname, 'project-dist')

    await fs.promises.rm(destinationFolder, {recursive: true, force: true})

    await fs.promises.mkdir(destinationFolder)

    // ASSETS
    const assetsDestinationFolder = path.join(destinationFolder, 'assets')
    const assetsSourceFolder = path.join(__dirname, 'assets')

    await fs.promises.mkdir(assetsDestinationFolder)

    await copyFolder(assetsSourceFolder, assetsDestinationFolder)

    // CSS
    const stylesSourceFolder = path.join(__dirname, 'styles')
    const stylesSources = await getFilesWithExtensionFromFolder(stylesSourceFolder, 'css')
    const dataFromCssFiles = (await readDataFromFiles(stylesSources)).join('')

    const outputCssFile = path.join(__dirname, 'project-dist', 'style.css')

    writeToFile(outputCssFile, dataFromCssFiles)

    // HTML
    const htmlSourceFile = path.join(__dirname, 'template.html')
    const sourceHtml = (await readDataFromFiles([htmlSourceFile])).join('')

    const componentsTemplate = /{{([a-zA-Z0-9]*)}}/g

    const found = Array.from(sourceHtml.matchAll(componentsTemplate))

    let response = sourceHtml
    const promises = found.map(match => new Promise(async (resolve, reject) => {
        const componentLocation = path.join(__dirname, 'components', `${match[1]}.html`)
        const componentText = await readComponent(componentLocation)
        response = response.replaceAll(`{{${match[1]}}}`, componentText)

        resolve()
    }))

    await Promise.all(promises).then(result => result)

    const htmlOutputFile = path.join(__dirname, 'project-dist', 'index.html')
    writeToFile(htmlOutputFile, response)
}


main()
