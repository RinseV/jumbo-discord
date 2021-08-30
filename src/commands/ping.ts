import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with roundtrip latency'),
    async execute(interaction: CommandInteraction) {
        const sent = (await interaction.reply({ content: 'Pinging...', fetchReply: true })) as Message;
        interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
    }
};
