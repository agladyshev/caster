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
}

var parseFeed = function (req, res, next) {
    parseString(res.feed, function (err, result) {
        res.feed = result;
        next();
    })

}

app.use(getFeed);

app.use(parseFeed);

app.get('/', function (req, res, next) {
    res.send(res.feed);
    console.log(typeof res.feed);
});

app.listen(port, () => console.log(`Listening`)); 