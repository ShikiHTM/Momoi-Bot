const fs = require('node:fs')

const JSONParse = Path => JSON.parse(fs.readFileSync(Path, 'utf8'))

module.exports = { JSONParse }
