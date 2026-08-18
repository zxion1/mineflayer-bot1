const mineflayer = require('mineflayer');
const mineflayerViewer = require('prismarine-viewer').mineflayer;

const PORT = process.env.PORT || 3000;

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP || 'play.wolfmc.fun', // Replace or set SERVER_IP environment variable
  port: 19299,
  username: 'AFK_Controller',
  version: false,
});

bot.once('spawn', () => {
  console.log('[+] Bot connected to main hub!');

  // Launch web viewer
  mineflayerViewer(bot, { port: PORT, firstPerson: true });
  console.log(`[+] Web viewer active on port ${PORT}`);

  // Automatically register upon spawning
  bot.chat('/register lollol lollol');

  // Wait 3 seconds, then send command to connect to classicboxpvp
  setTimeout(() => {
    bot.chat('/server classicboxpvp');
    console.log('[+] Sent command to switch server to classicboxpvp');
  }, 3000);
});

// Control via chat commands
bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  if (message === '!forward') {
    bot.setControlState('forward', true);
    setTimeout(() => bot.setControlState('forward', false), 1000);
  }
  if (message === '!jump') {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 350);
  }
  if (message === '!sneak') {
    bot.setControlState('sneak', !bot.getControlState('sneak'));
  }
});
