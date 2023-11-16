const {Events} = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    on: true,
    async execute(interation) {
        if(!interation.isChatInputCommand()) return;
        const command = interation.client.commands.get(interation.commandName);
    
        if(!command) {
            console.log(`No comment matching ${interation.commandName} was found.`);
            return;
        }
    
        try{
            await command.execute(interation);
        } catch(err) {
            console.log(err);
            if(interation.replied || interation.deferred) {
                await interation.followUp({ content: 'There was an error while executing this command', ephemeral: true});
            }
            await interation.reply({ content: 'There was an error while executing this command', ephemeral: true});
        }
    }
}