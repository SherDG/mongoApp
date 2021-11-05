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
    db.collection('users').insertOne({
        name: "Kate 2",
        age: 35
    });
    console.log('Data inserted!');

    // db.collection('tasks').insertMany([
    //     {
    //         _id: id,
    //         description: "Another My task 5",
    //         completed: true
    //     }
    // ], (error,result) => {
    //     if (error){
    //         return console.log('Cannot insert tasks!');
    //     }
    //     else{
    //          console.log(result.insertedIds)
    //         }
    // }
    // );
    // console.log('Data inserted!');
});




// async function run() {
//     try {
//         await client.connect();
//         console.log("Connected correctly to server");
//         const db = client.db(dbName);

//         const id = new ObjectId()
//         console.log(id);

//         // Use the collection "users"
//         // const col = db.collection("users");
//         const col = db.collection("tasks");

//         // Construct a document                                                                                                                                                              
//         // let personDocument = {
//         //     "name": { "first": "Al", "last": "Turing" },
//         //     "birth": new Date(1912, 5, 23), // June 23, 1912                                                                                                                                 
//         //     "death": new Date(1954, 5, 7),  // June 7, 1954                                                                                                                                  
//         //     "contribs": ["Turing machine", "Turing test", "Turingery"],
//         //     "views": 1250000
//         // }

//         // Insert a single document, wait for promise so we can read it back
//         // const p = await col.insertOne(personDocument);
//         const p = await col.insertMany([
//             {
//                 _id: id,
//                 description: 'Wipe',
//                 completed: true,
//             }
//         ]);

//         // Find one document
//         const myDoc = await col.findOne({_id: id});

//         // Print to the console
//         console.log(myDoc);
//     } catch (err) {
//         console.log(err.stack);
//     }

//     // finally {
//     //     await client.close();
//     // }
// }
// run().catch(console.dir);



// db.collection('users').insertOne({
//     name: "Dima",
//     age: 34
// });
// console.log('Data inserted!');
