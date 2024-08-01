import Ascii from 'ascii-table';
import { client } from '../..';
import { events } from '../../events';

export class eventHandler {
  static run() {
    const eventsTable = new Ascii('Events').setHeading('Name', 'Status', 'Reason');

    events.forEach(event => {
      if (!event.name || !event.run) return eventsTable.addRow(event.filename, '❌', 'Missing Name/Run');

      let name = event.name;

      if (event.nick) name += ` (${event.nick})`;

      if (event.once) client.once(event.name, async (...args) => await event.run(...args));
      else client.on(event.name, async (...args) => await event.run(...args));

      eventsTable.addRow(name, '✅');
    });

    client.console.info(eventsTable.toString());
  }
}
