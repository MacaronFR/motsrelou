const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require("https")
const {MessageEmbed} = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('Modifier un mot relou')
		.addStringOption(option => option.setName('mot').setRequired(true).setDescription("Le mot relou à modifier"))
		.addStringOption(option => option.setName('def').setRequired(true).setDescription("La définition du mot")),
	async execute(interaction) {
		const mot = interaction.options.getString('mot')
		const def = interaction.options.getString('def')
		if(mot === null || def === null){
			interaction.reply("Erreur: un mot et une définition doivent être fournit");
			return;
		}
		const get = {
			hostname: 'api.motrelou.fr',
			port: 443,
			path: '/mot/',
			method: "GET"
		}
		get.path += mot;
		const reqGet = https.request(get, (resp) => {
			let data = "";
			resp.on("data", (chunk) => {
				data += chunk
			})
			resp.on("end", () => {
				let res = JSON.parse(data);
				if(res.mot === undefined){
					let response = new MessageEmbed()
						.setColor('#ff8000')
						.setTitle("Mot introuvable")
						.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
						.addField(mot, def)
						.setTimestamp()
						.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
					interaction.reply({embeds: [response]})
				}else{
					const options = {
						hostname: 'api.motrelou.fr',
						port: 443,
						path: '/mot/' + mot + "/definition/1",
						method: "PUT",
						headers: {
							'Content-Type': 'application/json',
							'Content-Length': 0
						}
					}
					const postData = JSON.stringify({"definition": def});
					options.headers["Content-Length"] = postData.length;
					const reqPost = https.request(options, (resp) => {
						let data = "";
						resp.on("data", (chunk) => {
							data += chunk;
						});
						resp.on("end", () => {
							let response = new MessageEmbed()
								.setColor('#00FF00')
								.setTitle("Mis à jour")
								.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
								.addField(mot, def)
								.setTimestamp()
								.setFooter({text: 'Macaron Bot Mot Relou', iconURL: 'https://motsrelou.macaron-dev.fr/asset/logo.png'});
							interaction.reply({embeds: [response]});
						})
					})
					reqPost.write(postData);
					reqPost.end();
				}
			})
		})
		reqGet.end()
	},
}