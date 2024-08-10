import { loggers } from 'winston';
import { client } from '../..';

export class Event {
  static name = 'guildDelete';

  /**
   *
   * @param {import('discord.js').Guild} server
   */
  static async run(server) {
    if (loggers.get(server.id)) loggers.close(server.id);

    client.writeDevLog(`Left Server "${server.name}"`);
  }
}
