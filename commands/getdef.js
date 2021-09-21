const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require("https")


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
		.setName('getdef')
		.setDescription('Récuperer un mot aléatoire'),
	async execute(interaction) {
		const req = https.request(options, (resp) => {
			let data = "";
			resp.on("data", (chunk) => {
				data += chunk
			})
			resp.on("end", () => {
				interaction.reply(def);
			})
		})
		req.end()
	},
}