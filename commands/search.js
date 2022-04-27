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
		if(mot.length < 3){
			interaction.reply({embeds: [
				new MessageEmbed()
					.setColor("#ff6200")
					.setTitle("Recherche trop courte")
					.setDescription("La recherche \`" + mot + "\` est trop courte")
					.setTimestamp()
					.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'})
				]})
			return;
		}
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
					if (res.mots !== undefined) {
						response = new MessageEmbed()
							.setColor('#00ff00')
							.setTitle(mot)
							.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
							.setTimestamp()
							.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
						for (let i = 0; i < res.mots.length; ++i) {
							if (res.mots[i].def === "") {
								res.mots[i].def = "Pas de définition";
							}
							response.addField(res.mots[i].mot, res.mots[i].def);
						}
					} else {
						response = new MessageEmbed()
							.setColor('#ff6200')
							.setTitle(mot)
							.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
							.addField("Non trouvé", "Mot non présent dans la base. Désolé")
							.setTimestamp()
							.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
					}
				}catch (e){
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