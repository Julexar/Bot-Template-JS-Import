import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from './config';
import { logger } from './logger';
import { loggers } from 'winston';
import fs from 'fs';

let check = true;

export class DiscordClient extends Client {
  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });

    this.slashCommands = new Collection();
    this.prefixCommands = new Collection();
    this.contextCommands = new Collection();
    this.config = config;
    this.log = logger.log;
    this.console = logger.console;
  }

  start() {
    try {
      ['events', 'slashCommands', 'prefixCommands', 'contextCommands'].forEach(async handler => {
        const Handler = await import(`../handlers/${handler}`);
        Handler.run();
      });

      this.login(config.token);
    } catch (err) {
      this.logDevError(err);
    }
  }

  /**
   *
   * @param {import('discord.js').Guild} guild
   */
  chkServerLog(guild) {
    try {
      if (!fs.existsSync(`./src/server/logs/${guild.id}`)) fs.mkdirSync(`./src/server/logs/${guild.id}`);

      return loggers.get(`${guild.id}`);
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param {import('discord.js').Guild} guild
   */
  getLatestServerLog(guild) {
    try {
      const logFiles = fs.readdirSync(`./src/server/logs/${guild.id}`);
      return logFiles[logFiles.length - 1];
    } catch (err) {
      throw err;
    }
  }

  serverLogIsEmpty(guild, logFile) {
    return !fs.readFileSync(`./src/server/logs/${guild.id}/${logFile}`).length > 0;
  }

  /**
   *
   * @param {import('discord.js').Guild} guild
   * @param {string} content
   */
  async writeServerLog(guild, content) {
    try {
      const guildLog = this.chkServerLog(guild);
      const latestLog = this.getLatestServerLog(guild);

      //Check if logfile has no content
      if (!this.serverLogIsEmpty(guild, latestLog)) guildLog.info('========Beginning of new Log========');

      guildLog.info(content);

      this.writeDevLog(`Successfully wrote into Logfile of Server "${guild.name}"`);
    } catch (err) {
      this.logDevError(err);
    }
  }

  /**
   *
   * @param {import('discord.js').Guild} guild
   */
  async logServerError(guild, err) {
    try {
      const guildLog = this.chkServerLog(guild);
      const latestLog = this.getLatestServerLog(guild);

      //Check if logfile has no content
      if (!this.serverLogIsEmpty(guild, latestLog)) guildLog.info('========Beginning of new Log========');

      guildLog.error(`${err} - ${err.cause}`);
    } catch (err) {
      this.logDevError(err);
    }
  }

  /**
   *
   * @param {string} content
   */
  writeDevLog(content) {
    try {
      if (check) {
        this.log.info('========Beginning of new Log========');
        check = false;
      }

      this.log.info(content);
    } catch (err) {
      this.logDevError(err);
    }
  }

  logDevError(err) {
    if (check) {
      this.log.info('========Beginning of new Log========');
      check = false;
    }

    this.log.error(`${err} - ${err.cause}`);
  }
}
