

const mongoose = require("mongoose");
const dbName = 'task-manager';
const { MongoClient, ObjectId } = require('mongodb');


// !!!PASSWORD SHOULD BE ENCODED - 9!d#TKJKLcA3GZr --> https://www.urlencoder.org/
const url = "mongodb+srv://admin:9%21d%23TKJKLcA3GZr@testcluster.cagmu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        const id = new ObjectId()
        console.log(id);

        // Use the collection "users"/"tasks"
        const col = db.collection("tasks");

        // Construct a document                                                                                                                                                              
        // let personDocument = {
        //     "name": { "first": "Al", "last": "Turing" },
        //     "birth": new Date(1912, 5, 23), // June 23, 1912                                                                                                                                 
        //     "death": new Date(1954, 5, 7),  // June 7, 1954                                                                                                                                  
        //     "contribs": ["Turing machine", "Turing test", "Turingery"],
        //     "views": 1250000
        // }

        // Insert a single document, wait for promise so we can read it back
        // const p = await col.insertOne(personDocument);

        const p = await col.insertMany([
            {
                _id: id,
                description: 'Wipe',
                completed: true,
            }
        ]);

        // Find one document
        const myDoc = await col.findOne({_id: id});

        // Print to the console
        console.log(myDoc);
    } catch (err) {
        console.log(err.stack);
    }

    finally {
        await client.close();
    }
}

run().catch(console.dir);