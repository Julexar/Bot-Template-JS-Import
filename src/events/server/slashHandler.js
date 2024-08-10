import { client } from '../..';
import { BadRequestError, ForbiddenError } from '../../utils/errors';
import { ErrorEmbed } from '../../utils/embeds';

export class Event {
  static name = 'interactionCreate';
  static nick = 'Slash';

  /**
   *
   * @param {import('discord.js').Interaction} interaction
   */
  static async run(interaction) {
    try {
      const server = interaction.guild;

      if (!server) throw new BadRequestError('Invalid Server', 'Could not fetch the Server from the Interaction!');

      if (interaction.isChatInputCommand()) {
        const command = client.slashCommands.get(interaction.commandName);

        if (!command) throw new BadRequestError('Invalid Command', "The Command you are trying to execute does not exist in the Bot's files!");

        if (!command.enabled)
          throw new ForbiddenError(
            'Command Disabled',
            'This Command you are trying to execute has been temporarily disabled by the Developer for Maintenance!'
          );

        const channel = interaction.channel;

        if (command.permissions && command.permissions.bot && command.permissions.bot.length >= 1) {
          if (!channel.permissionsFor(server.me).has(command.permissions.bot)) {
            const perms = channel.permissionsFor(server.me).missing(command.permissions.bot);

            throw new ForbiddenError(
              'Bot missing Permissions',
              `I am missing the following Permissions to execute this Command:\n ${perms.map(perm => `\`${perm}\``).join(', ')}`
            );
          }
        }

        client.writeServerLog(server, `/${command.name} was executed by ${interaction.user.username} in #${channel.name}`);

        if (command.choices) command.setChoices();

        await command.run(interaction);
      }
    } catch (err) {
      if (err instanceof BadRequestError || err instanceof ForbiddenError)
        return await interaction.reply({ embeds: [new ErrorEmbed(err, false)], ephemeral: true });

      return await interaction.reply({ embeds: [new ErrorEmbed(err, true)], ephemeral: true });
    }
  }
}
