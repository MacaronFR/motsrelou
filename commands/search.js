const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require("https")
const {MessageEmbed} = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Rechercher un mot')
		.addStringOption(option => option.setName('recherche').setRequired(true).setDescription("Le mot à chercher")),
	async execute(interaction) {
		const options = {
			hostname: 'api.motrelou.fr',
			port: 443,
			path: '/mot?recherche=',
			method: "GET"
		}
		const recherche = interaction.options.getString('recherche');
		if(recherche.length < 3){
			interaction.reply({embeds: [
				new MessageEmbed()
					.setColor("#ff6200")
					.setTitle("Recherche trop courte")
					.setDescription("La recherche \`" + recherche + "\` est trop courte")
					.setTimestamp()
					.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'})
				]})
			return;
		}
		options.path += recherche;
		const req = https.request(options, (resp) => {
			let data = "";
			resp.on("data", (chunk) => {
				data += chunk
			})
			resp.on("end", () => {
				let response;
				try {
					let res = JSON.parse(data);
					if (res.length !== 0) {
						response = new MessageEmbed()
							.setColor('#00ff00')
							.setTitle(recherche)
							.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
							.setTimestamp()
							.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
						for (let i = 0; i < res.length; ++i) {
							if (res[i].definitions.length === 0) {
								response.addField(res[i].mot, "Pas de définition");
							}else{
								response.addField(res[i].mot, res[i].definitions[0].definition);
							}
						}
					} else {
						response = new MessageEmbed()
							.setColor('#ff6200')
							.setTitle(recherche)
							.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
							.addField("Non trouvé", "Désolé, je n'ai pas trouvé le mot que vous cherchez dans mon dictionnaire. Désolé")
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