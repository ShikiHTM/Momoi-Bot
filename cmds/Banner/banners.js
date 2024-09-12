const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { config } = require('dotenv')
const axios = require('axios')
const fs = require('node:fs')
const moment = require('moment/moment')
const { Arona } = require('./../../config/Game_Init_Config/arona.json')

config();

const TenHour = (10 * 60 * 60 * 1000);

const makeEmbed = (interaction, charName, charIcons, Color, School, StartAt, EndAt, BannerURLs) => {
	const embed = new EmbedBuilder()
		.setAuthor({
			name: charName, iconURL: charIcons
		})
		.setColor(Color)
		.setFields(
			{ name: "Start At:", value: StartAt, inline: true }, { name: "From:", value: School, inline: true },
			{ name: "End At:", value: EndAt, inline: true }
		)
		.setImage(BannerURLs)
		.setTimestamp()
		.setFooter({ text: `Give me 24k pyroxenes, ${interaction.user.displayName}-sensei`, iconURL: Arona });

	interaction.channel.send({
		embeds: [embed]
	})
}

const readJSONFile = (JSONPath) => JSON.parse(fs.readFileSync(JSONPath, 'utf-8'))

const isLimited = (Banner, name) => Banner == 'LimitedGacha' ? name + ' (Limited)' : name

const convertTime = (Time) => moment(new Date(Time - TenHour)).format("DD/MM/YYYY")

module.exports = {
	data: new SlashCommandBuilder().setName('banner').setDescription('Return current banner or upcoming banner!').addStringOption(option =>
		option.setName('type')
			.setDescription('Type of return value')
			.setRequired(true)
			.addChoices(
				{ name: 'current', value: 'current' },
				{ name: 'upcoming', value: 'upcoming' }
			)
	),

	async execute(interaction) {
		const UserChoice = interaction.options.getString('type')

		const school = readJSONFile('./Utils/Students/school.json');
		const SchoolColors = readJSONFile('./config/Game_Init_Config/BannerConfig/color.json');
		const StudentIcons = readJSONFile('./config/Game_Init_Config/BannerConfig/logo.json');
		const BannerURLs = readJSONFile('./config/Game_Init_Config/BannerConfig/bannerLink.json')

		const API = process.env.API;

		const resp = await axios.get(API + '/banner')

		let BannerResp, quotes

		UserChoice === 'current' ? BannerResp = resp.data.current : BannerResp = resp.data.upcoming

		UserChoice === 'current' ? quotes = 'Sensei! New banners have approached!' : quotes = 'Sensei! New banners are coming!'

		await interaction.reply({
			content: quotes
		})

		for (let char of BannerResp) {
			let name = char.rateups[0]
			let convertName = isLimited(char.gachaType, char.rateups[0])
			let timestart = convertTime(char.startAt)
			let timeend = convertTime(char.endAt)
			// interaction, charName, charIcons, Color, School, StartAt, EndAt, BannerURLs
			makeEmbed(interaction, convertName, StudentIcons[name], SchoolColors[school[name]], school[name], timestart, timeend, BannerURLs[name])
		}
	}
}
