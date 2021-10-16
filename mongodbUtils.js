const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');

// !!!PASSWORD SHOULD BE ENCODED - 9!d#TKJKLcA3GZr --> https://www.urlencoder.org/
const uri = "mongodb+srv://admin:9%21d%23TKJKLcA3GZr@testcluster.cagmu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connect = async (done) => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log("MongoDB connected!"))
            .catch((err) => console.log(err));
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

const disconnect = async () => {
    try {
        await mongoose.disconnect();
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

const dropCollection = async (collectionName) => {
    try {
        await mongoose.connection.collection(collectionName).drop();
    }
    catch (err) {
        if (err.code === 26) {
            console.log('namespace %s not found', collectionName)
        } else {
            throw new Error(err);
        }
    }
}

module.exports = {
    connect,
    disconnect,
    dropCollection
};