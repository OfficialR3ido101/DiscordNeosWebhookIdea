const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const cfg = require('./conf.json')
const bot = require('./init-bot')

const commands = [
  new SlashCommandBuilder().setName('forward')
  .setDescription('moves block +1').addStringOption(opt => opt.setName("funits").setDescription("How far you want this shit to go forwards")),
  new SlashCommandBuilder().setName('backwards')
  .setDescription('moves block -1').addStringOption(opt => opt.setName("bunits").setDescription("How far you want this shit to go backwards Do not include (-)")),
  new SlashCommandBuilder().setName('invis')
  .setDescription("Makes things go and cum back").addBooleanOption(opt => opt.setName("status").setDescription("Enable or disable items in neos")),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(cfg.discord.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(cfg.discord.CLI_ID, cfg.discord.GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
    bot.init();
  } catch (error) {
    console.error(error);
  }
})();
