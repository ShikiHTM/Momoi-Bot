const axios = require('axios')
const {config} = require('dotenv')
const { pingWhenANewRaidBossApperance } = require('../modules/PingWhen.Boss')
const JSONdb = require('simple-json-db')
const fs = require("node:fs")
const chalk = require('chalk')
config();

class Raid {
    constructor() {
        this.db = new JSONdb('./config/DatabaseConfig/Upcoming.raid.json')
        this.isChecking = false;
    }

    async RaidUpComing() {
        try{
            if(this.isChecking) {
                console.log("Skipping this round as a previous checking operation is still in progress.")
                return;
            }

            this.isChecking = true;
            const currentRaid = this.db.JSON();
            const respond = await axios.get(process.env.API + `/raid`).catch(e => {
                console.error(`Error during fetching API: ${e.message}`);
                return null;
            })
            // Make sure Upcoming raid is not undefined
            if(respond.data && respond.data.upcoming && currentRaid.name !== respond.data.upcoming[0].bossName) {
                // Set the new raid data
                this.db.set("id", respond.data.upcoming[0].seasonId)
                this.db.set("name", respond.data.upcoming[0].bossName)
                this.db.set("startAt", respond.data.upcoming[0].startAt)
                this.db.set("endAt", respond.data.upcoming[0].endAt)

                // Ping when a new raid boss appearance
                pingWhenANewRaidBossApperance(respond.data.upcoming[0].bossName, respond.data.upcoming[0].startAt, respond.data.upcoming[0].endAt)
            }else {
                console.log(`No new bosses has found! ${chalk.cyanBright('Arona')} will restart the checking in 10 minutes !`)
            }
        }catch(e) {
            console.error(`Error during RaidUpComing: ${e.message}`);
        }finally{
            this.isChecking = false;
        }
    }
}

module.exports = Raid