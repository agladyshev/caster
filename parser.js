const express = require('express');
const app = express();
const port = 3000;
const parseString = require('xml2js').parseStringPromise;
const axios = require('axios');
const mongo = require('./mongo');

var getFeedAll = function (req, res, next) {
    mongo.findPodcasts()
        .then(function (podcasts) {
            return Promise.all(podcasts.map((podcast) => getFeed(podcast.url)))
        })
        .then(function (podcasts) {
            res.podcasts = podcasts;
            next();
        })
}

// var updateFeedAll = function (req, res, next) {
//     mongo.findPodcasts()
//     .then(function(podcasts) {
//         return Promise.all(podcasts.map((podcast) => getFeed(podcast))) 
//     })
//     .then(function(podcast) {

//     })
//     .then(function(podcasts) {
//         res.podcasts = podcasts;
//         next();
//     })
// }


var getFeed = function (url) {
    return axios.get(url)
        .then((res) => res.data)
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
    getFeed(req.headers.url)
        .then(async function (podcast) {
            let result = await mongo.insertPodcast(podcast.url);
            res.podcast = podcast;
            next();
        })
}

app.use('/', express.static('public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
    next();
});

app.get('/get', getFeedAll, function (req, res, next) {
    res.send(res.podcasts);
});

app.post('/add', addPodcast, function (req, res, next) {
    res.send(res.podcast);
});

app.listen(port, () => console.log(`Listening`));