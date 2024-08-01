import { DiscordClient } from './client/lib/DiscordClient';
export const client = new DiscordClient();

client.start();
client.console.info('Bot started!');
