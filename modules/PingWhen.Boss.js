const { client } = require("../src");
const fs = require("fs")
const moment = require("moment")
const { CHANNEL } = require('./../config/config.json')
const { EmbedBuilder } = require('discord.js')

const fileToJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const path = './config/Game_Init_Config/RaidConfig'

function pingWhenANewRaidBossApperance(bossName, start, end) {
	console.log(`Sensei! New raid are coming!`)
	const upBanner = fileToJson(path + "/raid.json");
	const upColor = fileToJson(path + "/raidColor.json");

	setTimeout(() => {
		client.channels.cache.get(CHANNEL).send("Sensei! A new boss has come!")
	}, 3000)

	let startAt = new Date(start);
	let endAt = new Date(end);

	let formattedStart = moment(startAt).format("DD/MM/YYYY");
	let formattedEnd = moment(endAt).format("DD/MM/YYYY");
	const embed = new EmbedBuilder()
		.setTitle(bossName.replace(/ _/g, " "))
		.setColor(upColor[bossName])
		.setImage(upBanner[bossName])
		.setFields(
			{
				name: "Start At:", value: formattedStart, inline: true
			},
			{
				name: "End At:", value: formattedEnd, inline: true,
			}
		)
	setTimeout(() => {
		client.channels.cache.get(CHANNEL).send({
			embeds: [embed]
		})
	}, 3000)
}

module.exports = { pingWhenANewRaidBossApperance }
