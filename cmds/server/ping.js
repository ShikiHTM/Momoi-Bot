const { SlashCommandBuilder } = require('discord.js');
const { client } = require('../../src');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		interaction.reply(`YATTAAA\n CLEAAHHH: ${Date.now() - interaction.createdTimestamp}ms`)
	},
};