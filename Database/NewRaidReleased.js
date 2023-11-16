const axios = require('axios')
const {config} = require('dotenv')
const chalk = require('chalk')

const JSONdb = require('simple-json-db')

const db = new JSONdb('./.config/DatabaseConfig/Current.raid.json')

const curRaid = require('./../.config/DatabaseConfig/Current.raid.json')
const { pingWhenANewRaidBossApperance } = require('../modules/PingWhen.Boss')


config()

async function newRaidReleased() {
    axios.get(process.env.API + '/raid').then((c) => {
        const curBoss = c.data.current[0];

        if(!curBoss) {
            console.log(`${chalk.blue('Kivotos')} is at peace! sensei please take a rest, ${chalk.cyanBright('Arona')} will restart the checker after 10 minutes.`)       
        }

        const curId = curBoss.seasonId;
        const curName = curBoss.bossName;
        const startAt = curBoss.startAt;
        const endAt = curBoss.endAt;

        if(curRaid.id != curId || curRaid.name != curName) {
            db.set("id", curId), db.set("name", curName);
            pingWhenANewRaidBossApperance(curName, startAt, endAt);
            return;
        }

        return;
    })
}

setInterval((c) => {
    newRaidReleased()
}, 10*60*1000)