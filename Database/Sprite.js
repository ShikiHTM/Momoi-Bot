const axios = require('axios')
const fs = require('node:fs')

const studentData = fs.readFileSync('./Utils/Students/students.json', 'utf-8')
const students = JSON.parse(studentData)
const url = "https://schale.gg/images/weapon/";

const charPortrait = new Map()
const char = [];

function ReplaceWords(words) {
    if(words && String(words).includes("Bunny Girl")){ 
        words = words.replace("Bunny Girl", "Bunny")
        //console.log(words)
    };

    if(words && String(words).includes("Cheerleader")){ 
        words = words.replace("Cheerleader", "Cheer Squad")
        //console.log(words)
    };

    if(words && String(words).includes("Sportswear")){ 
        words = words.replace("Sportswear", "Track")
        //console.log(words)
    };

    if(words && String(words).includes("Kid")){ 
        words = words.replace("Kid", "Small")
        //console.log(words)
    };

    if(words && String(words).includes("Riding")){ 
        words = words.replace("Riding ", "Cycling")
        //console.log(words)
    };

    if(words && String(words).includes("Arisu")){ 
        words = words.replace("Arisu", "Aris")
        //console.log(words)
    };

    return words
}

const PortrailCrawler = async () => {
    const {data} = await axios.get(`https://raw.githubusercontent.com/lonqie/SchaleDB/main/data/en/students.json`)
    data.forEach((c, i) => {
        charPortrait.set(c.Name,url + ReplaceWords(c.WeaponImg) + '.webp')
    })
 
    fs.writeFileSync('./GunImgs.json', JSON.stringify(Object.fromEntries(charPortrait), null, 2));
}

PortrailCrawler()