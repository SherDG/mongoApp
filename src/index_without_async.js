const express = require("express");
require('./db/mongoose');
const User = require('./models/users');
const Task = require('./models/tasks');

const app = express();

const port = process.env.PORT || 3000

app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201);
        res.send(user);
    }).catch((e) => {
        res.status(400);
        res.send(e);
    })
});

app.get('/users', (req, res) => {  
    User.find({}).then((users) =>{
        res.status(200);
        res.send(users);
    }).catch((e)=>{
        res.status(500);
        res.send(e);
    })
});

app.get('/users/:id', (req, res) => {  
    const _id = req.params.id
    User.findById(_id).then((user) =>{
        if(!user){
            res.status(404).send();
        }
        res.status(200);
        res.send(user);
    }).catch((e)=>{
        res.status(500);
        res.send(e);
    })
});

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201);
        res.send(task);
    }).catch((e) => {
        res.status(400);
        res.send(e);
    })
});

app.get('/tasks', (req, res) => {  
    Task.find({}).then((tasks) =>{
        res.status(200);
        res.send(tasks);
    }).catch((e)=>{
        res.status(500);
        res.send(e);
    })
});

app.get('/tasks/:id', (req, res) => {  
    const _id = req.params.id
    Task.findById(_id).then((task) =>{
        if(!task){
            res.status(404).send();
        }
        res.status(200);
        res.send(task);
    }).catch((e)=>{
        res.status(500);
        res.send(e);
    })
});


app.listen(port, () => {
    console.log("Server is running on port " + port);
})