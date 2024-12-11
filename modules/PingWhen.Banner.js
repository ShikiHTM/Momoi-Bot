const { EmbedBuilder } = require('discord.js')
const { client } = require("../src");
const { CHANNEL } = require('./../config/config.json')
const fs = require("node:fs")
const { Arona } = require('./../config/Game_Init_Config/arona.json')
const moment = require('moment')

const ReadJSONFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

function PingWhenBanner(charName, charBannerURL, Time) {
	const schoolData = ReadJSONFile('./Utils/Students/school.json')
	const studentLogo = ReadJSONFile('./config/Game_Init_Config/BannerConfig/logo.json')
	const schoolColor = ReadJSONFile('./config/Game_Init_Config/BannerConfig/color.json')
	const startIn = moment(Time).format("DD/MM/YYYY")

	const embed = new EmbedBuilder()
		.setAuthor({
			name: 'New Banner released!', iconURL: studentLogo[charName]
		})
		.setColor(schoolColor[schoolData[charName]])
		.setImage(charBannerURL)
		.setFields(
			{
				name: "Name:", value: charName, inline: true
			},
			{
				name: "From:", value: schoolData[charName], inline: true
			},
			{
				name: "Start At:", value: startIn, inline: true
			}
		)
		.setTimestamp()
		.setFooter({
			text: 'Give us 1200 pyroxene, sensei', iconURL: Arona
		})

	setTimeout(() => {
		client.channels.cache.get(CHANNEL).send({
			embeds: [embed]
		})
	}, 3000)
}

module.exports = { PingWhenBanner }
