const cheerio = require('cheerio');
const axios = require('axios'); const jsondb = require('simple-json-db');
const { PingWhenBanner } = require('../modules/PingWhen.Banner');
const { CHANNEL } = require('./../config/config.json')
const chalk = require('chalk')

const fs = require('node:fs').promises

let db = new jsondb('./config/Game_Init_Config/BannerConfig/bannerLink.json');
let limts = require('./../config/DatabaseConfig/limits.json');
const { client } = require('../src');
let oldlimts = limts.current
let path = './config/DatabaseConfig/limits.json'
let newLimitsIndex;
let sDB = new jsondb('./Utils/Students/school.json')

let isScraping = 0;

//Replace specific words
function ReplaceWords(words) {
	if (words) {
		words = words.replace("Bunny Girl", "Bunny")
			.replace("Cheerleader", "Cheer Squad")
			.replace("Sportswear", "Track")
			.replace("Kid", "Small")
			.replace("Riding ", "Cycling")
			.replace("Arisu", "Aris");
	}
	return words
}
function handleNewBanners(charName, charImgs, Time) {
	const channel = client.channels.cache.get(CHANNEL)
	console.log(`New ${chalk.blueBright('Students')} has apperance! Sensei please give me 1200 ${chalk.blue('pyroxense')}`)
	channel.send("Sensei! New students are coming!")
	for (let i = 0; i < charImgs.length; ++i) {
		let currentIndex = i + oldlimts + 1;
		let currentCharName = charName[currentIndex];
		let currentCharBanner = charImgs[i];
		let currentCharTime = Time[currentIndex];

		axios.get('https://api.ennead.cc/buruaka/character').then(c => {
			let characterData = c.data.find(char => char.name == currentCharName)
			sDB.set(currentCharName, characterData.school)
		})

		PingWhenBanner(currentCharName, currentCharBanner, currentCharTime)
	}
}

async function updateLimitsFile() {
	try{
			await fs.writeFile(path, JSON.stringify(limts, null, 2));
			console.log('Limits updated successfully');
	}catch(err) {
			console.error(`Failed to write to limits.json: ${err.message}`)
	}
}

let startTime;

async function BannerCrawling() {
	try{		
		if(isScraping) {
			console.log("Skipping this round as a previous scraping operation is still in progress.")
			return;
		}

		isScraping = 1;
		startTime = Date.now();

		const respone = await axios.get('https://bluearchive.wiki/wiki/Banner_List_(Global)');
		const $ = cheerio.load(respone.data);

		const imgs = [], charName = [], rawDate = [], convertDate = [];

		//Get Images
		$("td.image").each((i, el) => {
			const img = $(el).find("img").attr("src").replace("//", "https://")

			if (i > newLimitsIndex) {
				newLimitsIndex = i; // Take the new limit
				imgs.push(img);
			}
		})

		// //Get student's name
		$("td").each((i, el) => {
			let charN = $(el).find("a").attr("title");

			charN = ReplaceWords(charN)

			if (charN) charName.push(charN);
		})

		//Get date
		$("td").each((i, el) => {
			$(el).find("i").remove("i");
			$(el).find("a").remove("a")

			if ($(el).text() != '') rawDate.push($(el).text())
		})

		rawDate.forEach(el => {
			let format = new Date(el.split(" ")[0])
			convertDate.push(format.getTime())
		})


		//Auto-Ping
		if (Number.isInteger(newLimitsIndex) && limts.current < newLimitsIndex) {
			//update the database
			for (let i = 0; i < imgs.length; ++i) {
				let tmpIndex = i + limts.current + 1;
				db.set(charName[tmpIndex], imgs[i]);
			}

			//update Limits
			limts.current = newLimitsIndex;

			await updateLimitsFile();

			handleNewBanners(charName, imgs, convertDate)
			return;
		}
		console.log("No new banners found or tmp is invalid")
		return;
	}catch(err){
		console.log(`err during BannerCrawling:${err.message}`)
	}finally{
		const EclipsedTime = Date.now() - startTime;
		console.log(`Scraping completed in ${EclipsedTime / 1000} seconds`)
		isScraping = 0;
	}

}

setTimeout(() => {
	BannerCrawling();
}, 3000)

// setInterval(() => {
// 	BannerCrawling();
// }, 60 * 10 * 1000);
