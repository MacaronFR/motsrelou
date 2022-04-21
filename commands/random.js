const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require("https")
const {MessageEmbed} = require("discord.js");


const options = {
	hostname: 'motsrelou.macaron-dev.fr',
	port: 443,
	path: '/random',
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
						.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
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