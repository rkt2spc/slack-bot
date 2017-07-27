const request = require('request');
const cheerio = require('cheerio');

// Exports
exports.ask = (message, callback) => {
  request.post({
    url: 'https://kakko.pandorabots.com/pandora/talk?botid=a9f77c5a1e345a0b',
    form: { message: message },
  }, (err, response) => {
    if (err) return callback(err);
    
    const $ = cheerio.load(response.body);
    let answer = $('body font font p font').text();
    answer = answer.match(/Mitsuku: (.+)\n?/);
    answer = answer ? answer[1] : '';
    answer = answer.trim();
    callback(null, answer);
  });
};
