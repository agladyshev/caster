const express = require('express');
const app = express();
const port = 3000;
const parseString = require('xml2js').parseStringPromise;
const request = require('request-promise-native');
const mongo = require('./mongo');

var getFeedAll = function (req, res, next) {
    mongo.findPodcasts()
    .then(function(podcasts) {
        return new Promise(function (resolve, reject) {
            // podcasts = db.collection.find();
            podcasts.forEach(function (podcast, index, array) {
                request(podcast.url)
                .then(parseString)
                .then(function (feed) {
                    podcast.feed = feed.rss.channel[0];
                    (index == 0) && resolve(podcasts);
                })
                .catch(function (error) {
                    console.log(error);
                })    
            });
        })
    })   
    .then(function(podcasts) {
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
    mongo.insertPodcast(req.headers.url);
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