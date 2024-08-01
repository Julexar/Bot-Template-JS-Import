import Ascii from 'ascii-table';
import { client } from '../..';
import { commands } from '../../server/commands/prefix';

export class prefixHandler {
  static run() {
    const commandsTable = new Ascii('Prefix Commands').setHeading('Command', 'Status', 'Reason');

    commands.forEach(command => {
      if (!command.name || !command.run) return commandsTable.addRow(command.filename, '❌', 'Missing Name/Run');

      let name = command.name;

      if (command.nick) name += ` (${command.nick})`;

      if (!command.enabled) return commandsTable.addRow(name, '❌', 'Disabled');

      client.prefixCommands.set(command.name, command);
      commandsTable.addRow(name, '✅');
    });

    client.console.info(commandsTable.toString());
  }
}
