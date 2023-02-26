const fs = require('node:fs');
const readline = require("readline");
const path = require('node:path');
const sol_quotes = [];

const wait = require('node:timers/promises').setTimeout;

const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
require('dotenv/config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
})

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on('ready', async () => {
	
});

client.on('messageCreate', message => {

});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()){
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}

	if (interaction.isStringSelectMenu()){
		if (interaction.customId === 'select') {
			const selected = interaction.values[0];

			const modal = new ModalBuilder()
				.setTitle('Suggestion')

			if(selected == 'ANON') modal.setCustomId('anonSuggestModal');
			if(selected == 'PUBLIC') modal.setCustomId('publicSuggestModal');

			const suggestionBox = new TextInputBuilder()
				.setCustomId('suggestionBox')
				// The label is the prompt the user sees for this input
				.setLabel("What's your suggestion?")
				// Short means only a single line of text
				.setStyle(TextInputStyle.Paragraph);

			const actionRow = new ActionRowBuilder().addComponents(suggestionBox);
			modal.addComponents(actionRow);
			// await interaction.deleteReply();
			await interaction.showModal(modal);
			// await interaction.update({ content: selected, components: [modal] });
		}
	}

	if(interaction.isModalSubmit()){
		var outputChannel = ""
		if(interaction.customId == 'anonSuggestModal') outputChannel = process.env.ANON_SUGGESTION_CHANNEL_ID
		if(interaction.customId == 'publicSuggestModal') outputChannel = process.env.PUBLIC_SUGGESTION_CHANNEL_ID

		const suggestion = interaction.fields.getField('suggestionBox').value
		console.log(suggestion)

		await interaction.update({ content: "Suggestion submitted!", components: [] });
		await client.channels.cache.get(outputChannel).send(suggestion);

	}
});

client.login(process.env.TOKEN);