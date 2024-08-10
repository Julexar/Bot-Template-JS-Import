import { client } from '../..';
import { loggers, format, transports } from 'winston';
import moment from 'moment';
import fs from 'fs';

export class Event {
  static name = 'guildCreate';

  /**
   *
   * @param {import('discord.js').Guild} server
   */
  static async run(server) {
    // Logile Creation
    await this.checkServerLogger(server);

    // Interval Creation
    await this.createInterval(server);

    // Guild Slash Command Registration
    //await this.registerSlashCommands(server);
  }

  static async getLatestServerLog(server) {
    const logs = fs.readdirSync(`./src/server/logs/${server.id}`);
    return logs[logs.length - 1];
  }

  /**
   *
   * @param {import('discord.js').Guild} server
   */
  static async checkServerLogger(server) {
    const date = new Date().toISOString();
    const latestLogTime = (await this.getLatestServerLog(server)).replace('.log', '');
    const difference = moment(date).diff(moment(latestLogTime), 'hours');

    if (loggers.get(server.id) && difference > 23) loggers.close(server.id);

    loggers.add(server.id, {
      format: format.combine(
        format.timestamp(),
        format.printf(info => `[${info.level}] ${info.message}`)
      ),
      transports: [new transports.File({ filename: `./src/server/logs/${server.id}/${date}.log` })],
    });
  }

  /**
   *
   * @param {import('discord.js').Guild} server
   */
  static async createInterval(server) {
    setInterval(
      async () => {
        await this.checkServerLogger(server);
      },
      1000 * 60 * 60 * 24
    );
  }

  /**
   *
   * @param {import('discord.js').Guild} server
   */
  static async registerSlashCommands(server) {
    try {
      await server.commands.set(client.slashCommands);

      client.writeDevLog(`Successfully registered Slash Commands for Server "${server.name}"`);
    } catch (err) {
      client.logDevError(err);
    }
  }
}
