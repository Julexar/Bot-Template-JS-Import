import { client } from '../..';

await registerSlashCommands();
await registerContextCommands();

async function registerSlashCommands() {
  if (!client.slashCommands) return;

  for (const command of client.slashCommands) {
    if (client.application.commands.cache.has(command.name)) {
      const existingCommand = client.application.commands.cache.get(command.name);
      client.application.commands.edit(existingCommand.id, command);
    } else {
      client.application.commands.create(command);
    }
  }
}

async function registerContextCommands() {
  if (!client.contextCommands) return;

  for (const command of client.contextCommands) {
    if (client.application.commands.cache.has(command.name)) {
      const existingCommand = client.application.commands.cache.get(command.name);
      client.application.commands.edit(existingCommand.id, command);
    } else {
      client.application.commands.create(command);
    }
  }
}