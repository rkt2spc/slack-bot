const _ = require('lodash');
const Slack = require('@slack/client');
const MemoryDataStore = Slack.MemoryDataStore;
const RtmClient = Slack.RtmClient;
const Events = Object.assign({}, Slack.CLIENT_EVENTS.RTM, Slack.RTM_EVENTS);

const bot = new RtmClient(process.env.BOT_TOKEN, {
  logLevel: 'error',
  dataStore: new MemoryDataStore()
});

// Log notification when authenticated
bot.on(Events.AUTHENTICATED, (info) => {
  Object.assign(bot, { 
    info: _.pick(info.self, ['id', 'name']), 
    team: _.pick(info.team, ['id', 'name']),
  });
  console.log(`Bot authenticated as [${bot.info.name}] of team [${bot.team.name}]`);
});

// Callback when connection established, do whatever operation needed inside callback
bot.on(Events.RTM_CONNECTION_OPENED, () => {
  console.log('Waiting messages...');

  // Assign me as master >:3
  const master = bot.dataStore.getUserByName('nmtuan');

  // On Message
  bot.on(Events.MESSAGE, (message) => {
    // Someone mentioned our bot
    if (message.text && (
      message.text.includes(bot.info.id) || 
      message.text.includes(bot.info.name)
    )) {
      // Default response
      let response = 'Nói cái gì vậy trời?';

      // Message from master
      if (message.user === master.id) {
        // Commanding message
        if (
          message.text.includes('nghe chưa') || 
          message.text.includes('biết hông') ||
          message.text.includes('hiểu chưa')
        ) {
          response = _.sample([
            `Dạ em biết rồi ạ`,
            `Anh <@${master.id}> dạy phải`,
          ]);
        }
        // Normal message 
        else {
          response = _.sample([
            `Anh <@${master.id}> có gì sai bảo ạ?`,
            `Thưa anh <@${master.id}> em nghe`,
            `Em đây ạ`,
          ]);
        }
      }
      // Message from stranger 
      else {
        response = `<@${message.user}> Kiu gì tui đó? Tui chỉ trả lời master <@${master.id}> thui <3`;
      }

      // Send response
      bot.sendMessage(response, message.channel);
    }
  });


});

bot.start();

// [Optional] Start an http server so heroku doesn't complain
const http = require('http');
const morgan = require('morgan');
const express = require('express');
const app = express();
app.use(morgan('dev'));
app.use((req, res) => res.status(200).end('Hello there, I\'m a slave of master nmtuan'));

http.createServer(app).listen(process.env.PORT || 1337);