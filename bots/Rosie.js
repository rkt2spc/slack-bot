const request = require('request');
const cheerio = require('cheerio');

// Exports
exports.ask = (message, callback) => {
  request.post({
    url: 'https://www.pandorabots.com/pandora/talk?botid=b16e613a3e341aa4',
    form: { message: message },
  }, (err, response) => {
    if (err) return callback(err);

    const $ = cheerio.load(response.body);
    $('body form').remove();
    let answer = $('body').text();
    answer = answer.replace('Tell Rosie:', '');
    answer = answer.match(/Rosie: (.+)\n?/)[1];
    answer = answer.trim();
    callback(null, answer);
  });
};
