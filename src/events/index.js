import fs from 'fs';

const events = [];
const dirs = fs.readdirSync('./src/events');

for (const dir of dirs) {
  const files = fs.readdirSync(`./src/events/${dir}`).filter(file => file.endsWith('.js'));

  for (const file of files) {
    const event = require(`./src/events/${dir}/${file}`);
    event.filename = file;
    events.push(event);
  }
}

export { events };
