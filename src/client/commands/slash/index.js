import fs from 'fs';

const commands = new Set();
const dirs = fs.readdirSync('./src/client/commands/slash');

for (const dir of dirs) {
  const files = fs.readdirSync(`./src/client/commands/slash/${dir}`).filter(file => file.endsWith('.js'));

  for (const file of files) {
    const command = require(`./${dir}/${file}`);
    commands.add(command);
  }
}

export { commands };