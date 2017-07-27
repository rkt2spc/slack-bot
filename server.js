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
