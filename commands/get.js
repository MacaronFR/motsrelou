const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require("https")
const {MessageEmbed} = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription('Rechercher un mot exact')
		.addStringOption(option => option.setName('mot').setRequired(true).setDescription("Le mot à chercher")),
	async execute(interaction) {
		const options = {
			hostname: 'motsrelou.macaron-dev.fr',
			port: 443,
			path: '/get?mot=',
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
				try {
					let res = JSON.parse(data);
					if (res.mot !== undefined) {
						response = new MessageEmbed()
							.setColor('#00ff00')
							.setTitle(mot)
							.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
							.setTimestamp()
							.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
						if (res.def === "") {
							res.def = "Pas de définition";
						}
						response.addField(res.mot, res.def);
					} else {
						response = new MessageEmbed()
							.setColor('#ff6200')
							.setTitle(mot)
							.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
							.addField("Non Trouvé", "Mot non présent dans la base. Désolé")
							.setTimestamp()
							.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
					}
				}catch (e){
					console.log(e)
					console.log(data);
					response = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle("Erreur")
						.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
						.addField("Erreur", e.message)
						.setTimestamp()
						.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
				}
				interaction.reply({embeds:[response]});
			})
		})
		req.end()
	},
}