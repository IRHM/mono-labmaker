import DiscordClient from './client';
import path from 'path';
import * as fs from 'fs';

export async function registerCommands(
  client: DiscordClient,
  dir: string = ''
) {
  if (dir === '') dir = '../commands';
  const filePath = path.join(__dirname, dir);
  const files = await fs.promises.readdir(filePath);

  for (const file of files) {
    if ((await fs.promises.lstat(path.join(filePath, file))).isDirectory())
      registerCommands(client, path.join(dir, file));

    if (file.endsWith('.ts')) {
      const { default: Command } = await import(`${dir}/${file}`);
      const command = new Command();
      client.commands.set(command.getName(), command);
      command.getAliases().forEach((alias: string) => {
        client.commands.set(alias, command);
      });
    }
  }
}

export async function registerEvents(client: DiscordClient, dir: string = '') {
  if (dir === '') dir = '../events';
  const filePath = path.join(__dirname, dir);
  const files = await fs.promises.readdir(filePath);

  for (const file of files) {
    if ((await fs.promises.lstat(path.join(filePath, file))).isDirectory())
      registerCommands(client, path.join(dir, file));

    if (file.endsWith('.ts')) {
      const { default: Event } = await import(`${dir}/${file}`);
      const event = new Event();
      client.events.set(event.name, event);
      client.on(event.getName(), event.run.bind(event, client));
    }
  }
}
