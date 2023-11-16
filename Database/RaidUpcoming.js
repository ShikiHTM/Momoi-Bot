const axios = require('axios')
const {config} = require('dotenv')
const fs = require('node:fs')
const { pingWhenANewRaidBossApperance } = require('../modules/PingWhen.Boss')
const JSONdb = require('simple-json-db')
const chalk = require('chalk')

const db = new JSONdb('./.config/DatabaseConfig/Upcoming.raid.json')

const curRaidData = require('./../.config/DatabaseConfig/Upcoming.raid.json')
const boss = require('../cmds/Raid/boss')

config();

const RaidUpcomming = () => {
    axios.get(process.env.API + `/raid`).then((c) => {
        const upComming = c.data.upcoming[0];

        if(!upComming) {
            console.log(`No new bosses has found! ${chalk.cyanBright('Arona')} will restart the checking in 10 minutes !`)
            return;
        }
        const nextId = upComming.seasonId;
        const bossName = upComming.bossName;
        const start = upComming.startAt;
        const end = upComming.endAt;
        if(curRaidData.id != nextId || curRaidData.name != bossName) {
            db.set("id", nextId)
            db.set("name", bossName)
            pingWhenANewRaidBossApperance(bossName, start, end);
        }
        return;
    })
}
setInterval(() => {
    RaidUpcomming()
}, 10*60*1000)