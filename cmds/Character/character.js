const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { JSONParse } = require('./../../Utils/JSONData.js')
const { config } = require('dotenv')
const { GetStudentArray } = require('./../../Utils/studentArray.js')
const createButton = (id, emoji, style) => new ButtonBuilder().setCustomId(id).setEmoji(emoji).setStyle(style)
const axios = require('axios')

config()

const GetStudentStar = (rarity) => {
	let star = ""
	for(let i = 0; i < rarity; i++) {
		star += '⭐';
	}
	return star
}

const GetArmorColor  = (armor) => {
	let colorEmoji;
	switch(armor) {
		case 'Light':
			colorEmoji = '🟨';
			break;
		case 'Heavy':
			colorEmoji = '🟥';
			break;
		case 'Special':
			colorEmoji = '🟦';
			break;
	}
	return colorEmoji
}

const GetBulletColor = (bullet) => {
	let colorEmoji;
	switch(bullet) {
		case 'Piercing':
			colorEmoji = '🟡';
			break;
		case 'Explosive':
			colorEmoji = '🔴';
			break;
		case 'Mystic':
			colorEmoji = '🔵';
			break;
	}
	return colorEmoji
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get a specific student\'s information')
		.addStringOption(option => {
			option.setName('name')
				.setDescription('Specific studen\'s name')
				.setRequired(true)
			return option
		}),

	async execute(interaction) {
		const StudentName = interaction.options.getString('name')

		const studentList = GetStudentArray()

		if (studentList.indexOf(StudentName) == -1) {
			interaction.reply('This student wasn\'t exist! Sensei please try again!\n' + 'Ensure that you Uppercase the first Letter of student name\n' + 'Some special situation like Shiroko (Cycling), Aris (Maid), Cherino (Hot Spring), Yuuka (Track), Utaha (Cheer Squad)... then you have to write it correctly')
			return;
		}

		const forwardID = 'forward'
		const backwardID = 'backward'

		const forwardEmoji = '1029435213157240892'
		const backwardEmoji = '1029435199462834207'

		// Create button
		const forward = createButton(forwardID, forwardEmoji, ButtonStyle.Primary)
		const backward = createButton(backwardID, backwardEmoji, ButtonStyle.Primary)

		// Utils
		const MaxOfPage = 3
		const BeginPage = 1

		const SchoolColor = JSONParse('./config/Game_Init_Config/BannerConfig/color.json')
		const School = JSONParse('./Utils/Students/school.json')
		const SchoolLogo = JSONParse('./config/Game_Init_Config/StudentAsset/schoolLogo.json')
		const StudentIcon = JSONParse('./config/Game_Init_Config/BannerConfig/logo.json')

		const resp = await axios.get(process.env.API + '/character')

		const Student = resp.data.find((c) => c.name == StudentName)

		// Page 1: Summary
		const Summary = {
			color: parseInt(SchoolColor[School[StudentName]].replace(/#/g, '0x')),
			author: {
				name: StudentName,
				icon_url: SchoolLogo[School[StudentName]]
			},
			description: Student.profile,
			fields: [
				{name: 'Rarity:', value: GetStudentStar(Student.baseStar) + ` (${Student.rarity})`},
				{name: 'Position:', value: Student.position, inline: true},
				{name: 'Role:', value: Student.role, inline: true},
				{name: 'Weapon:', value: Student.weaponType, inline: true},
				{name: 'Bullet Type', value: Student.bulletType + ' ' + GetBulletColor(Student.bulletType), inline: true},
				{name: 'Armor Type:', value: Student.armorType + ' ' + GetArmorColor(Student.armorType), inline: true},
				{ name: '\u200B', value: '\u200B', inline:true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Urban:', value: Student.terrain.urban.DamageDealt, inline: true },
				{ name: 'Outdoor:', value: Student.terrain.outdoor.DamageDealt, inline: true },
				{ name: 'Indoor:', value: Student.terrain.indoor.DamageDealt, inline: true }
			],
			thumbnail: {
				url: StudentIcon[StudentName]
			},
			timestamp: new Date().toISOString(),
			footer: {
				text: `Page ${BeginPage} of ${MaxOfPage}`
			}
		}

		await interaction.reply({
			embeds: [Summary],
			components: [new ActionRowBuilder().addComponents(forward)]
		})
		// Page 2: Skill

		// Page 3: Portrait
	}
}
