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


module.exports = {
    findPodcasts,
    insertPodcast,
  };