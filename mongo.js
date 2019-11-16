const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}${process.env.DB_HOST}/${process.env.DATABASE}?retryWrites=true&w=majority`;

const connectDB = function(uri) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });     
    return client.connect()
    .then(function(client) {
        return client;
    })
    .catch(function (err) {
        console.log(err);
    })    
}    

const closeDB = function(client) {
    client.close();
}

const findPodcasts = function() {
    return connectDB(uri)
        .then(function(client) {
            const db = client.db(process.env.DB_NAME);
            const col = db.collection("podcasts");
            return col.find({}).toArray()
        .then(function(podcasts) {
            closeDB(client);
            return podcasts;
        })
        .catch(function (err) {
            console.log(err);
        }) 
    })    
}    

const insertPodcast = function(url) {
    return connectDB(uri)
        .then(function(client) {
            const db = client.db(process.env.DB_NAME);
            const col = db.collection("podcasts");
            col.insertOne({ url: url })
            closeDB(client);
        })
        .catch(function (err) {
            console.log(err);
        }) 
}

const updatePodcast = function(podcast) {
    return connectDB(uri)
        .then(function(client) {
            const db = client.db(process.env.DB_NAME);
            const col = db.collection("podcasts");
            col.update({ _id: podcast._id }, podcast);
            closeDB(client);
        })
        .catch(function (err) {
            console.log(err);
        }) 
}

const updatePodcastsAll = function(podcasts) {
    let client;
    return connectDB(uri)
        .then(function(clientDB) {
            client = clientDB;
            const db = client.db(process.env.DB_NAME);
            const col = db.collection("podcasts");
            return Promise.all(podcasts.map(podcast => col.replaceOne({ _id: podcast._id }, podcast)));
        })
        .then(function() {
            closeDB(client);
        })
        .catch(function (err) {
            console.log(err);
        }) 
}

module.exports = {
    findPodcasts,
    insertPodcast,
  };

// findPodcasts()
// .then(function (podcasts) {
//     podcasts.forEach(podcast => {
//         podcast.title = "test6";
//     });
//     return podcasts;
// })
// .then(function(podcasts) {
//     return updatePodcastsAll(podcasts);
// })
// .then(function() {
//     findPodcasts()
//     .then(podcasts => console.log(podcasts))
// })