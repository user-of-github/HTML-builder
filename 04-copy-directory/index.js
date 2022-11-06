const fs = require('fs')
const path = require('path')


const copy = async (srcDir, dstDir) => {
    const files = await fs.promises.readdir(srcDir).then(data => data)

    const promises = files.map(file => new Promise((resolve, reject) => {
        const src = srcDir + '/' + file
        const dst = dstDir + '/' + file

        try {
            fs.promises.writeFile(dst, fs.readFileSync(src))
        } catch (e) {
            console.log('could\'t copy file: ' + dst + 'Error: ' + e)
        }

        resolve()
    }))

    return await Promise.all(promises).then(result => result)
}

const main = async () => {
    const source = path.join(__dirname, 'files')
    const destination = path.join(__dirname, 'files-copy')

    await fs.promises.rm(destination, {recursive: true, force: true})
    await fs.promises.mkdir(destination)

    await copy(source, destination)
}

main()
