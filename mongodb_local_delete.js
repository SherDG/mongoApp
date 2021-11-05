// start DB on Linux --> sudo systemctl start mongod 
// start DB on Mac --> - brew services start mongodb-community@5.0
// Stop - brew services stop mongodb-community@5.0

const mongo = require("mongodb");
const mongoClient = mongo.MongoClient;

const dbName = 'task-manager';
const url = 'mongodb://localhost:27017';
const { MongoClient, ObjectId } = require('mongodb');

const id = new ObjectId();
console.log(id);

mongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect!');
    }

    console.log('Connected to DB!');
    const db = client.db(dbName);

   db.collection('users').deleteOne({ 
        _id: new ObjectId("616fd2674eaf6ee68aab8c07")
    }).then((result)=>{
        console.log(result);
    }).catch((error)=>{
        console.log(error);
    });

});




