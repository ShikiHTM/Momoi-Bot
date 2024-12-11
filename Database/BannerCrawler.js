const cheerio = require('cheerio');
const axios = require('axios');
const jsondb = require('simple-json-db');
const {PingWhenBanner} = require('../modules/PingWhen.Banner');
const {CHANNEL} = require('./../config/config.json')
const chalk = require('chalk')
const fs = require('node:fs').promises

class BannerCrawler {
    constructor() {
        this.db = new jsondb('./config/Game_Init_Config/BannerConfig/bannerLink.json');
        this.sDB = new jsondb('./Utils/Students/school.json')
        this.limits = require('../config/DatabaseConfig/limits.json')
        this.oldLimits = require('../config/DatabaseConfig/limits.json').current;
        this.isScraping = false;
        this.newLimitsIndex = 0;
        this.startTime = null;
        this.client = require('../src').client;
    }

    replaceWords(words) {
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

    async updateLimitsFile() {
        console.log("Updating limit file...");
        try {
            await fs.writeFile('./config/DatabaseConfig/limits.json', JSON.stringify(this.limits, null, 2));
            console.log("Successfully update limit file");
        } catch (e) {
            console.log(`Failed to write to limit file: ${e.message}`);
        }
    }

    handleNewBanners(charName, charImgs, Time) {
        const channel = this.client.channels.cache.get(CHANNEL);
        console.log(`New ${chalk.blueBright('Students')} has appearance! Sensei please give me 1200 ${chalk.blue('pyroxense')}`)
        channel.send("Sensei! New students are coming!")

        for (let i = this.oldLimits; i < charImgs.length; i++) {
            let currentIndex = 1 + i;
            let currentCharName = charName[currentIndex];
            let currentCharBanner = charImgs[i];
            let currentCharTime = Time[currentIndex];

            axios.get('https://api.ennead.cc/buruaka/character').then(c => {
                const characterData = c.data.find(char => char.name === currentCharName)
                if (characterData) {
                    this.sDB.set(currentCharName, characterData.school)
                }
            })

            PingWhenBanner(currentCharName, currentCharBanner, currentCharTime);
        }
    }

    async BannerCrawling() {
        try {
            if (this.isScraping) {
                console.log("Skipping this round as a previous scraping operation is still in progress.")
                return;
            }

            this.isScraping = true;
            this.startTime = Date.now();

            const respond = await axios.get('https://bluearchive.wiki/wiki/Banner_List_(Global)')
            const $ = cheerio.load(respond.data);
            let imgs = [], charName = [], rawDate = [], convertDate = []

            $("td.image").each((i, el) => {
                let img = $(el).find("img").attr("src")?.replace("//", "https://");
                if (img && i > this.newLimitsIndex) {
                    this.newLimitsIndex = i
                    imgs.push(img)
                }
            })

            $("td").each((i, el) => {

                const charN = this.replaceWords($(el).find("a").attr("title"));
                if (charN) charName.push(charN);
            })
            $("td").each((i, el) => {
                $(el).find("i, a").remove();
                const textContext = $(el).text().trim();
                if (textContext) rawDate.push(textContext);
            })
            rawDate.forEach(el => {
                const format = new Date(el.split(" ")[0]);
                convertDate.push(format.getTime());
            })
            if (Number.isInteger(this.newLimitsIndex) && this.limits.current < this.newLimitsIndex) {
                imgs.forEach((img, i) => {
                    const tmpIndex = i + this.limits.current + 1;
                    this.db.set(charName[tmpIndex], img);
                })
                this.limits.current = this.newLimitsIndex;
                await this.updateLimitsFile();
                this.handleNewBanners(charName, imgs, convertDate);
            } else {
                console.log(`No new banners found! ${chalk.cyanBright('Arona')} will restart the checking in 10 minutes!`);
            }
        } catch (e) {
            console.error(`Error during BannerCrawling: ${e.message}`);
        } finally {
            const elapsedTime = Date.now() - this.startTime;
            console.log(`Scraping completed in ${elapsedTime / 1000} seconds.`);
            this.isScraping = false;
        }
    }
}

module.exports = BannerCrawler