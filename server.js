const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mineflayer = require('mineflayer');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let bot = null;

io.on('connection', (socket) => {
  console.log('Dashboard connected');

  socket.on('startBot', (config) => {
    if (bot) return socket.emit('status', 'Bot is already running');

    // Applied your target IP and Port defaults
    bot = mineflayer.createBot({
      host: config.host || 'play.wolfmc.fun',
      port: config.port || 19299,
      username: config.username || 'AFK_Bot'
    });

    bot.on('spawn', () => {
      io.emit('status', 'Bot connected and AFK!');
      
      // Jump every 15 seconds to prevent AFK kick
      setInterval(() => {
        if (bot) {
          bot.setControlState('jump', true);
          setTimeout(() => { if (bot) bot.setControlState('jump', false); }, 500);
        }
      }, 15000);
    });

    bot.on('error', (err) => {
      io.emit('status', `Error: ${err.message}`);
    });

    bot.on('end', () => {
      io.emit('status', 'Bot disconnected');
      bot = null;
    });
  });

  socket.on('stopBot', () => {
    if (bot) {
      bot.quit();
      bot = null;
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Client running on port ${PORT}`));
