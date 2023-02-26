const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Make a suggestion to the club'),
        async execute(interaction) {
            
			// interaction.client.channels.cache.get('1048679829123379303').send('Hello here!');

			//pub/anon selector
			const selector = new ActionRowBuilder()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('select')
						.setPlaceholder('Nothing selected')
						.addOptions(
							{
								label: 'Public',
								description: 'Share & petition your idea to the club publicly',
								value: 'PUBLIC',
							},
							{
								label: 'Anonymous',
								description: 'Share your suggestion or concern to the club eboard anonymously',
								value: 'ANON',
							},
						)
				);
				interaction.reply({content: "Is your suggestion public or anonymous?", components: [selector]})

		}
}