const mineflayer = require('mineflayer');
const inventoryViewer = require('mineflayer-web-inventory');

// Server Configuration
const SERVER_HOST = 'play.wolfmc.fun';
const SERVER_PORT = 19299;

// List of 4 unique bot usernames
const BOT_NAMES = [
  'AFK_Controller_1',
  'AFK_Controller_2',
  'AFK_Controller_3',
  'AFK_Controller_4'
];

function createBotInstance(username, index) {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: username,
    version: false,
  });

  // Attach web inventory viewer to the first bot
  if (index === 0) {
    const webPort = process.env.PORT || 3000;
    inventoryViewer(bot, { port: webPort });
    console.log(`[+] Web dashboard active on port ${webPort} for ${username}`);
  }

  bot.once('spawn', () => {
    console.log(`[+] Bot ${username} connected!`);

    // 1. Send registration command
    bot.chat('/register botbot botbot');

    // 2. Switch server after 3 seconds
    setTimeout(() => {
      bot.chat('/server classicboxpvp');
      console.log(`[+] ${username} sent: /server classicboxpvp`);

      // 3. Send AFK command after server transfer
      setTimeout(() => {
        bot.chat('/afk');
        console.log(`[+] ${username} sent: /afk`);
      }, 3000);
    }, 3000);
  });

  // In-game chat controls
  bot.on('chat', (sender, message) => {
    if (BOT_NAMES.includes(sender)) return;

    if (message === '!jump') {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 350);
    }
    if (message === '!sneak') {
      bot.setControlState('sneak', !bot.getControlState('sneak'));
    }
  });

  bot.on('error', (err) => console.log(`[!] Error [${username}]:`, err));
  bot.on('end', () => console.log(`[-] Bot ${username} disconnected.`));
}

// Connect bots sequentially with a 4-second delay to avoid connection limits
BOT_NAMES.forEach((name, index) => {
  setTimeout(() => {
    createBotInstance(name, index);
  }, index * 4000);
});
