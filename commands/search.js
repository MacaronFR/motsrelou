const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require("https")
const {MessageEmbed} = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Rechercher un mot')
		.addStringOption(option => option.setName('mot').setRequired(true).setDescription("Le mot à chercher")),
	async execute(interaction) {
		const options = {
			hostname: 'motsrelou.macaron-dev.fr',
			port: 443,
			path: '/search?mot=',
			method: "GET"
		}
		const mot = interaction.options.getString('mot')
		options.path += mot;
		const req = https.request(options, (resp) => {
			let data = "";
			resp.on("data", (chunk) => {
				data += chunk
			})
			resp.on("end", () => {
				let response;
				try{
					let mot = JSON.parse(data).mot;
					let def = JSON.parse(data).def;
					if (def === ""){
						def = "Pas de définition";
					}
					response = new MessageEmbed()
						.setColor('#00ff00')
						.setTitle(mot)
						.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
						.addField(mot, def)
						.setTimestamp()
						.setFooter('Macaron Bot Mot Relou', 'https://motsrelou.macaron-dev.fr/asset/logo.png');
				}catch (e){
					response = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle("Erreur")
						.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
						.addField("Erreur", "Mot non trouvé. Désolé")
						.setTimestamp()
						.setFooter('Macaron Bot Mot Relou', 'https://motsrelou.macaron-dev.fr/asset/logo.png');
				}
				interaction.reply({embeds:[response]});
			})
		})
		req.end()
	},
}