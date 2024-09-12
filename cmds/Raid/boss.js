const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios')
const fs = require('node:fs')
const moment = require('moment')
const { Arona } = require('../../config/Game_Init_Config/arona.json')
const { config } = require('dotenv')

config();

const readJSONFile = (JSONpath) => {
	return JSON.parse(fs.readFileSync(JSONpath, 'utf-8'))
}

const makeEmbed = (interaction, quotes, bossName, startAt, endAt, BannerURLs, Color) => {
	const embed = new EmbedBuilder()
		.setAuthor({ name: bossName.replace(/_/g, ' ') })
		.setColor(Color)
		.setImage(BannerURLs)
		.addFields(
			{ name: 'Start At:', value: startAt, inline: true },
			{ name: 'End At:', value: endAt, inline: true }
		)
		.setTimestamp()
		.setFooter({ text: `Sensei, please give Arona 24k pyroxenses`, iconURL: Arona })

	interaction.reply({
		content: quotes,
		embeds: [embed]
	})
}

const convertTime = (Time) => {
	return moment(new Date(Time)).format("DD/MM/YYYY")
}

const path = "./config/Game_Init_Config/RaidConfig/";

module.exports = {
	data: new SlashCommandBuilder().setName("raid").setDescription("Get current or upcomming raid!").addStringOption(option => option.setName('type').setDescription('Type of raids').setRequired(true).addChoices({ name: 'current', value: 'current' }, { name: 'upcoming', value: 'upcoming' })),

	async execute(interaction) {
		const Raid = readJSONFile(path + 'raid.json')
		const RaidColor = readJSONFile(path + 'RaidColor.json')
		const isCurrent = interaction.options.getString('type') === 'current';

		const { data } = await axios.get(process.env.API + '/raid')

		const raidSyntax = isCurrent ? data.current[0] : data.upcoming[0];

		if (!raidSyntax) {
			const quotes = isCurrent ? "Kivotos is at peace, Sensei please take a rest!" : "Kivotos will at peace in the future, Sensei please take a rest!"

			interaction.reply(quotes);
			return;
		}

		const raidName = raidSyntax.bossName;
		const raidStart = convertTime(raidSyntax.startAt);
		const raidEnd = convertTime(raidSyntax.endAt)

		const quotes = isCurrent ? `${interaction.user.displayName}-sensei, ${raidName.replace(/_/g, " ")}'s assault Kivotos!` : `${interaction.user.displayName}-sensei, ${raidName.replace(/_/g, " ")}'s coming! Please give us instructions!`;

		makeEmbed(interaction, quotes, raidName, raidStart, raidEnd, Raid[raidName], RaidColor[raidName]);
	}
}
