import Ascii from 'ascii-table';
import { client } from '../..';
import { commands } from '../../server/commands/context';

export class contextHandler {
  static run() {
    const commandsTable = new Ascii('Context Commands').setHeading('Command', 'Status', 'Reason');

    commands.forEach(command => {
      if (!command.name || !command.run) return commandsTable.addRow(command.filename, '❌', 'Missing Name/Run');

      let name = command.name;

      if (command.nick) name += ` (${command.nick})`;

      if (!command.enabled) return commandsTable.addRow(name, '❌', 'Disabled');

      client.contextCommands.set(command.name, command);
      commandsTable.addRow(name, '✅');
    });

    client.console.info(commandsTable.toString());
  }
}
