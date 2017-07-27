// Meta
const blacklist = [];
const session = {};

const bot = require('./bots/Mitsuku');
const slack = require('./slack');
slack.onMessage((message) => {
  let question = message.text;
  question = question.replace(new RegExp(`<@${slack.client.info.id}>`), '');

  bot.ask(question, (err, answer) => {
    if (err) slack.sendMessage(err.message, message.channel);
    else if (answer.length !== 0) {
      answer = `<@${message.user}> ${answer}`;
      answer = answer.replace('Mousebreaker', slack.client.master.name);
      slack.sendMessage(answer, message.channel);
    }
  });
});

// HTTP Server
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const router = express.Router();
router.post('/message', (req, res) => {
  slack.sendMessage(req.body.message, req.body.channel);
  res.status(200).end('Success');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);
app.use((err, req, res, next) => res.status(500).json(err));

const PORT = process.env.PORT || 8080;
http.createServer(app).listen(PORT, () => console.log('Server is listening on port', PORT));