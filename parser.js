const express = require('express');
const app = express();
const port = 3000;
const parseString = require('xml2js').parseStringPromise;
const request = require('request-promise-native');

// request('https://changelog.com/jsparty/feed', function (error, response, body) {
//     console.log('error', error);
//     console.log('statusCode', response && response.statusCode);
//     // console.log('body:', body);
//     parseString(body, function (err, result) {
//         console.dir(result);
//     })
// })

let podcasts = [
    {
        name: "JSParty",
        url: "https://changelog.com/jsparty/feed",
        feed: ""
    },
    {
        name: "Darknet Diaries Bonus Episodes",
        url: "https://www.patreon.com/rss/darknetdiaries?auth=ZIjB2P_mT5qL2e5wX4SC7Kk0G5yxRWR_",
        feed: ""
    },
    {   
        name: "Darknet Diaries",
        url: "https://darknetdiaries.com/feedfree.xml",
        feed: ""
    }
]


var getFeed = function (req, res, next) {   
    new Promise(function (resolve, reject) {
        podcasts.forEach(function (podcast, index, array) {
            request(podcast.url)
            .then(parseString)
            .then(function (feed) {
                podcast.feed = feed.rss.channel[0];
                (index == 0) && resolve();
            })
            .catch(function (error) {
                console.log(error);
            })    
        });
    })
    .then(function() {
        // console.log(podcasts);
        res.podcasts = podcasts;
        next();
    })

}

// var requestFeed = function (podcast) {
//     return request(podcast.url)
//     .then(function (xml) {
//         podcast.feed = xml;
//     })
//     .catch(function (error) {
//         console.log(error);
//     })
// }

// var parseFeed = function (podcast) {
//     console.log(podcast);
//     parseString(podcast.feed, function (err, result) {
//         podcast.feed = result;
//         // console.log(result);
//         // next();
//         console.log(podcast);
//         return podcast;
//     })
// }

app.use('/', express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
    next();
});

app.get('/get', getFeed, function (req, res, next) {
    // console.log(res.feed.rss.channel.item);
    // let channel = res.feed.rss.channel[0];
    // let items = res.feed.rss.channel[0].item;
    res.send(res.podcasts);
});

app.listen(port, () => console.log(`Listening`)); 