import { client } from '../..';
import { BadRequestError, ForbiddenError } from '../../utils/errors';
import { ErrorEmbed } from '../../utils/embeds';

export class Event {
  static name = 'messageCreate';
  static nick = 'Prefix';

  /**
   *
   * @param {import('discord.js').Message} message
   */
  static async run(message) {
    try {
      const server = message.guild;

      if (!server) throw new BadRequestError('Invalid Server', 'Could not fetch the Server from the Message!');

      const prefix = client.config.prefix;

      if (message.content.toLocaleLowerCase().startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/\s+--/);
        const command = args.shift().toLowerCase();

        const cmd = client.prefixCommands.get(command) || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

        if (!cmd) throw new BadRequestError('Invalid Command', "The Command you are trying to execute does not exist in the Bot's files!");

        const channel = message.channel;

        if (cmd.permissions) {
          if (cmd.permissions.member && cmd.permissions.member.length >= 1) {
            const perms = channel.permissionsFor(message.member).missing(cmd.permissions.member);

            throw new ForbiddenError(
              'Missing Permissions',
              `You are missing the following Permissions to execute this Command:\n ${perms.map(perm => `\`${perm}\``).join(', ')}`
            );
          }

          if (cmd.permissions.bot && cmd.permissions.bot.length >= 1) {
            if (!channel.permissionsFor(server.me).has(cmd.permissions.bot)) {
              const perms = channel.permissionsFor(server.me).missing(cmd.permissions.bot);

              throw new ForbiddenError(
                'Bot missing Permissions',
                `I am missing the following Permissions to execute this Command:\n ${perms.map(perm => `\`${perm}\``).join(', ')}`
              );
            }
          }
        }

        if (cmd.args) {
          if (!cmd.optional) {
            if (args.length < cmd.usage.length) {
              const usage = cmd.usage.join(' ');

              throw new BadRequestError(
                'Missing Arguments',
                `The Command requires you to use its arguments. The correct usage is:\n\`${prefix}${cmd.name} ${usage}\``
              );
            }
          }
        } else if (!cmd.args && args.length >= 1) {
          throw new BadRequestError('Invalid Arguments', `The Command does not have any arguments. The correct usage is:\n\`${prefix}${cmd.name}\``);
        }

        client.writeServerLog(
          server,
          `${prefix}${cmd.name} was executed by ${message.author.username} in #${channel.name}${args.length >= 1 ? ` with the following arguments: ${args.join(', ')}` : ''}`
        );

        await cmd.run(message, args);
      }
    } catch (err) {
      if (err instanceof ForbiddenError || err instanceof BadRequestError) return await message.reply({ embeds: [new ErrorEmbed(err, false)] });

      return await message.reply({ embeds: [new ErrorEmbed(err, true)] });
    }
  }
}
