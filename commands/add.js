const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require("https")
const qr = require("querystring")
const {MessageEmbed} = require("discord.js");


const options = {
	hostname: 'motsrelou.macaron-dev.fr',
	port: 443,
	path: '/add',
	method: "POST",
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': 0
	}
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Ajouter un mot relou à la base')
		.addStringOption(option => option.setName('mot').setRequired(true).setDescription("Le mot relou à ajouter"))
		.addStringOption(option => option.setName('def').setRequired(true).setDescription("La définition du mot")),
	async execute(interaction) {
		const mot = interaction.options.getString('mot')
		const def = interaction.options.getString('def')
		if(mot === null || def === null){
			interaction.reply("Erreur: un mot et une définition doivent être fournit");
			return;
		}
		const postData = qr.stringify({"mot": mot, "def": def})
		options.headers["Content-Length"] = postData.length
		const req = https.request(options, (resp) => {
			let data = "";
			resp.on("data", (chunk) => {
				data += chunk
			})
			resp.on("end", () => {
				let response;
				if(JSON.parse(data).message === "ajout OK") {
					let avatar;
					if(interaction.member.user.avatar !== null) {
						avatar = "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + (interaction.member.user.avatar.startsWith("a_") ? ".gif" : ".png");
					}else{
						avatar = "https://cdn.discordapp.com/embed/avatars/" + (parseInt(interaction.member.user.discriminator) % 5) + ".png";
					}
					response = new MessageEmbed()
						.setColor('#00FF00')
						.setAuthor(interaction.member.user.username, avatar)
						.setTitle('Mot Ajouté')
						.setThumbnail("https://motsrelou.macaron-dev.fr/asset/logo.png")
						.addField(mot, def)
						.setTimestamp()
						.setFooter('Macaron Bot Mot Relou', 'https://motsrelou.macaron-dev.fr/asset/logo.png');
				}else{
					response = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle('Mot existant')
						.setThumbnail('https://motsrelou.macaron-dev.fr/asset/logo.png')
						.addField(mot, def)
						.setTimestamp()
						.setFooter('Macaron Bot Mot Relou', 'https://motsrelou.macaron-dev.fr/asset/logo.png');
				}
				interaction.reply({embeds:[response]});
			})
		})
		req.write(postData)
		req.end()
	},
}