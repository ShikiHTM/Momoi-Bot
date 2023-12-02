const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { config } = require('dotenv')
const axios = require('axios')
const fs = require('node:fs')
const moment = require('moment/moment')
const { Arona } = require('./../../config/Game_Init_Config/arona.json')

config();

const makeEmbed = (interaction, charName, charIcons, Color, School, StartAt, EndAt, BannerURLs) => {
	const embed = new EmbedBuilder()
		.setAuthor({
			name: charName, iconURL: charIcons
		})
		.setColor(Color)
		.setFields(
			{ name: "Start At:", value: StartAt, inline: true },
			{ name: "From:", value: School, inline: true },
			{ name: "End At:", value: EndAt, inline: true }
		)
		.setImage(BannerURLs)
		.setTimestamp()
		.setFooter({ text: `Give me 24k pyroxenes, ${interaction.user.displayName}-sensei`, iconURL: Arona });

	interaction.channel.send({
		embeds: [embed]
	})
}

const readJSONFile = (JSONPath) => {
	return JSON.parse(fs.readFileSync(JSONPath, 'utf-8'))
}

const isLimited = (Banner, name) => {
	return Banner == 'LimitedGacha' ? name + ' (Limited)' : name
}

const convertTime = (Time) => {
	const TenHour = (10 * 60 * 60 * 1000);

	return moment(new Date(Time - TenHour)).format("DD/MM/YYYY")
}

module.exports = {
	data: new SlashCommandBuilder().setName('banner').setDescription('Return current banner!'),

	async execute(interaction) {
		const school = readJSONFile('./Utils/Students/school.json');
		const SchoolColors = readJSONFile('./config/Game_Init_Config/BannerConfig/color.json');
		const StudentIcons = readJSONFile('./config/Game_Init_Config/BannerConfig/logo.json');
		const BannerURLs = readJSONFile('./config/Game_Init_Config/BannerConfig/bannerLink.json')

		const API = process.env.API;

		axios.get(API + '/banner').then((c) => {
			const datas = c.data;

			const currentBanner = datas.current;
			currentBanner.forEach((student) => {
				const gachaType = student.gachaType;

				const name = student.rateups[0];
				isLimited(gachaType) ? name + ' (Limited)' : name;

				const dateStart = convertTime(student.startAt);
				const dateEnd = convertTime(student.endAt);
				makeEmbed(interaction, name, StudentIcons[name], SchoolColors[school[name]], school[name], dateStart, dateEnd, BannerURLs[name]);
			})
		})
	}
}
