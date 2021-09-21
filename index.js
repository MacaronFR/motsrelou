const fs = require('fs');
const { Client, Intents, Collection, Guild} = require('discord.js');
const { token } = require('./config.json');
const cp = require("child_process")

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    const guilds = client.guilds.cache.map(guild => guild.id)
    for(guildId in guilds){
        cp.exec("node deploy-command.js " + guilds[guildId])
    }
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on("guildCreate", (guild) => {
    cp.exec("node deploy-command.js " + guild.id)
})

client.login(token);

// invit
//https://discord.com/api/oauth2/authorize?client_id=878194265069596702&permissions=380104674304&scope=bot%20applications.commands