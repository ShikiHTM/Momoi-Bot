const {REST, Routes} = require('discord.js');
const {clientId} = require('../config/config.json');
const fs = require('node:fs');
const path = require('node:path');
const {config} = require('dotenv')

config()
const commands = [];

const folderPaths = path.join(__dirname, '../cmds');
const folderInside = fs.readdirSync(folderPaths);

for(const folder of folderInside) {
    const commandsPath = path.join(folderPaths, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(c => c.endsWith('.js'));
    
    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if('data' in command && 'execute' in command) commands.push(command.data.toJSON());
        else console.log(`[WARNING] The command at ${filePath} are missing 'data' or 'execute' property.`);
    }
}
const rest = new REST().setToken(process.env.TOKEN);

(async() => {
    try{
        console.log(`Started refreshing ${commands.length} application (/) commands`)

        const data = await rest.put(Routes.applicationCommands(clientId), {body: commands})
        
        console.log(`Success reloaded ${data.length} application (/) commands`);
    } catch(err) {
        console.log(err);
    }
})()
