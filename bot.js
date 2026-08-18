const mineflayer = require('mineflayer');
const mineflayerViewer = require('prismarine-viewer').mineflayer;

const PORT = process.env.PORT || 3000;

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP || 'play.wolfmc.fun',
  port: 25565,
  username: 'iwabtjkey',
  version: false,
});

bot.once('spawn', () => {
  console.log('[+] Bot connected!');
  mineflayerViewer(bot, { port: PORT, firstPerson: true });
  console.log(`[+] Web viewer active on port ${PORT}`);
});

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
