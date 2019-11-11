const express = require('express');
const app = express();
const port = 3000;
const parseString = require('xml2js').parseString;
const request = require('request-promise-native');

// request('https://changelog.com/jsparty/feed', function (error, response, body) {
//     console.log('error', error);
//     console.log('statusCode', response && response.statusCode);
//     // console.log('body:', body);
//     parseString(body, function (err, result) {
//         console.dir(result);
//     })
// })

var getFeed = function (req, res, next) {
    request('https://changelog.com/jsparty/feed')
    .then(function (xml) {
        res.feed = xml;
        next();
    })
    .catch(function (error) {
        console.log(error);
    })
}

var parseFeed = function (req, res, next) {
    parseString(res.feed, function (err, result) {
        res.feed = result;
        next();
    })

}

app.use('/', express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
    next();
});

app.get('/get', getFeed, parseFeed, function (req, res, next) {
    // console.log(res.feed.rss.channel.item);
    let channel = res.feed.rss.channel[0];
    let items = res.feed.rss.channel[0].item;
    res.send(channel);
});

app.listen(port, () => console.log(`Listening`)); 