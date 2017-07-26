const _ = require('lodash');
const Slack = require('@slack/client');
const MemoryDataStore = Slack.MemoryDataStore;
const RtmClient = Slack.RtmClient;
const Events = Object.assign({}, Slack.CLIENT_EVENTS.RTM, Slack.RTM_EVENTS);

// Slack Client
const client = new RtmClient(process.env.SLACK_TOKEN, {
  logLevel: 'error',
  dataStore: new MemoryDataStore()
});

// Log notification when authenticated
client.on(Events.AUTHENTICATED, (info) => {
  Object.assign(client, {
    authenticated: true,
    info: _.pick(info.self, ['id', 'name']),
    team: _.pick(info.team, ['id', 'name']),
    master: _.chain(info.users).find((u) => u.name === 'nmtuan').pick(['id', 'name']).value(),
  });
  console.log(`Authenticated as [${client.info.name}] of team [${client.team.name}]`);
});

// Callback when connection established, do whatever operation needed inside callback
client.on(Events.RTM_CONNECTION_OPENED, () => console.log('Connected'));

// Start client
client.start();

// Exports
exports.client = client;
exports.sendMessage = client.sendMessage.bind(client);
exports.onMessage = (callback) => client.on(Events.MESSAGE, (message) => {
  if (message.text && (message.text.includes(client.info.id) || message.text.includes(client.info.name))) {
    callback(message);
  }
});