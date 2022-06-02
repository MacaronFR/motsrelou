const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require("https")
const {MessageEmbed} = require("discord.js");


const options = {
	hostname: 'api.motrelou.fr',
	port: 443,
	path: '/mot/random',
	method: "GET"
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('Récuperer un mot aléatoire'),
	async execute(interaction) {
		const req = https.request(options, (resp) => {
			let data = "";
			resp.on("data", (chunk) => {
				data += chunk
			})
			resp.on("end", () => {
				let response;
				try{
					let mot = JSON.parse(data);
					response = new MessageEmbed()
						.setColor('#00ff00')
						.setTitle(mot.mot)
						.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
						.setTimestamp()
						.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
					if (mot.definitions.length === 0){
						response.addField(mot, def)
					}else{
						response.addField(mot.mot, mot.definitions[0].definition)
					}
				}catch (e){
					response = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle("Erreur")
						.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
						.addField("Erreur", "Pendant la récupération. Désolé")
						.setTimestamp()
						.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
				}
				interaction.reply({embeds:[response]});
			})
		})
		req.end()
	},
}