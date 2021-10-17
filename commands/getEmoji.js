const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getemoji')
		.setDescription("Récupérer l'image d'un emoji custom")
		.addStringOption(option => option.setName("emoji").setDescription("Emoji à récupérer").setRequired(true)),
	async execute(interaction) {
		let emoji = interaction.options.getString("emoji");
		emoji = emoji.substring(emoji.indexOf('<') + 2, emoji.indexOf('>'));
		emoji = emoji.substring(emoji.indexOf(':') + 1);
		interaction.reply("https://cdn.discordapp.com/emojis/" + emoji + ".png");
	},
}