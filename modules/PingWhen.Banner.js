const { EmbedBuilder } = require('discord.js')
const { client } = require("../src");
const { CHANNEL } = require('./../.config/config.json')
const fs = require("node:fs")
const {Arona} = require('./../.config/Game_Init_Config/arona.json')
const moment = require('moment')

function PingWhenBanner(charName, charBannerURL, Time) {
<<<<<<< HEAD
    const schoolData = fs.readFileSync('./init/Students/school.json')
=======
    const schoolData = fs.readFileSync('./Utils/Students/school.json')
>>>>>>> d768418 (Re-construct the entire code)
    const rawSchoolData = JSON.parse(schoolData)
    const studentLogo = fs.readFileSync('./.config/Game_Init_Config/BannerConfig/logo.json')
    const rawLogo = JSON.parse(studentLogo)
    const schoolColor = fs.readFileSync('./.config/Game_Init_Config/BannerConfig/color.json')
    const rawColor = JSON.parse(schoolColor)
    const startIn = moment(Time).format("DD/MM/YYYY")
    
    const embed = new EmbedBuilder()
    .setAuthor({
        name: 'New Banner released!', iconURL: rawLogo[charName]
    })
    .setColor(rawColor[rawSchoolData[charName]])
    .setImage(charBannerURL)
    .setFields(
        {
            name:"Name:", value: charName, inline:true
        },
        {
            name:"From:", value: rawSchoolData[charName], inline: true
        },
        {
            name: "Start At:", value: startIn, inline:true
        }
    )
    .setTimestamp()
    .setFooter({
        text: 'Give us 1200 pyroxene, sensei', iconURL: Arona
    })

    setTimeout(c => {
        client.channels.cache.get(CHANNEL).send({
            embeds: [embed]
        })
    }, 3000)
    }

module.exports = {PingWhenBanner}