const axios = require('axios')
const JSONdb = require('simple-json-db');
const cheerio = require('cheerio')
const url = `https://schale.gg/images/student/collection/`

db = new JSONdb(`./logo.json`)

const fs = require('node:fs')

const striData = fs.readFileSync('./init/Students/students.json')
const rawStriData = JSON.parse(striData);

for(const data in rawStriData) {
    console.log(rawStriData[data]);
    db.set(data, url + rawStriData[data] + '.webp');
}