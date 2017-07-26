const request = require('request');
const cheerio = require('cheerio');

// Exports
exports.ask = (message, callback) => {
  request.post({
    url: 'http://demo.vhost.pandorabots.com/pandora/talk?botid=ac28c6669e36b194',
    form: { message: message },
  }, (err, response) => {
    if (err) return callback(err);
    
    const $ = cheerio.load(response.body);
    $('body form').remove();
    let answer = $('body').text();
    answer = answer.replace('Tell A.L.I.C.E:', '');
    answer = answer.match(/A\.L\.I\.C\.E: (.+)\n?/)[1];
    answer = answer.trim();
    callback(null, answer);
  });
};
