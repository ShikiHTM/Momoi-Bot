const {Events} = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready. Login as ${client.user.tag}, welcome aboard Goushujin-sama`);
    }
}