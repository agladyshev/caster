const express = require('express');
const app = express();
const port = 3000;
const parseString = require('xml2js').parseStringPromise;
const request = require('request-promise-native');

let podcasts = [
    {
        url: "https://changelog.com/jsparty/feed",
        feed: ""
    },
    {
        url: "https://www.patreon.com/rss/darknetdiaries?auth=ZIjB2P_mT5qL2e5wX4SC7Kk0G5yxRWR_",
        feed: ""
    },
    {   
        url: "https://darknetdiaries.com/feedfree.xml",
        feed: ""
    }
]

var getFeedAll = function (req, res, next) {   
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
        res.podcasts = podcasts;
        next();
    })
}

var getFeed = function (url) {
    return request(url)
    .then(parseString)
    .then(function (feed) {
        return {
            url: url,
            feed: feed.rss.channel[0]
        }
    })
    .catch(function (error) {
        console.log(error);
    })   
}

var addPodcast = function (req, res, next) {
    console.log(getFeed);
    getFeed(req.headers.url)
    .then(function(podcast) {
        res.podcast = podcast;
        next();
    })
}
    
app.use('/', express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
    next();
});

app.get('/get', getFeedAll, function (req, res, next) {
    res.send(res.podcasts);
});

app.post('/add', addPodcast, function (req, res, next) {
    console.log(res.podcast);
    res.send(res.podcast);
});

app.listen(port, () => console.log(`Listening`)); 