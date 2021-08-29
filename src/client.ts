import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, ClientOptions, Collection, CommandInteraction } from 'discord.js';

interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export class CommandClient extends Client {
    commands: Collection<string, Command> = new Collection();

    constructor(options: ClientOptions) {
        super(options);
    }
}
