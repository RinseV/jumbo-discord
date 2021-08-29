import dotenvSafe from 'dotenv-safe';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readdirSync } from 'fs';
import { resolve } from 'path';

dotenvSafe.config();

const dirPath = resolve(__dirname, './commands');

const commands: string[] = [];
const commandFiles = readdirSync(dirPath).filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(`${dirPath}/${file}`);
    console.log(`Loading command ${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN!);

(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!), {
            body: commands
        });

        console.log('Deployed commands');
    } catch (error) {
        console.error(error);
    }
})();
