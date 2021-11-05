// start DB on Linux --> sudo systemctl start mongod 
// start DB on Mac --> - brew services start mongodb-community@5.0
// Stop - brew services stop mongodb-community@5.0
const express = require("express");
require('./db/mongoose');
const User = require('./models/users');
const Task = require('./models/tasks');
const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());

app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201);
        res.send(user);
    }
    catch (e) {
        res.status(400);
        res.send(e);
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200);
        res.send(users);
    }
    catch (e) {
        res.status(500);
        res.send(e);
    }
});

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200);
        res.send(user);
    }
    catch (e) {
        res.status(500);
        res.send(e);
    }
});

app.patch('/users/:id', async (req, res) => {
    const _id = req.params.id;

    const addlowedFields = ["name", "age", "password", "email"];
    const fieldsFromRequest = Object.keys(req.body);

    const isOperationValid = fieldsFromRequest.every((fieldFromRequest) => {
        return addlowedFields.includes(fieldFromRequest);
    });

    if (!isOperationValid) {
        return res.status(400).send({ "error": "This field is not allowed to update." });
    }
    else {

        try {
            const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
            if (!user) {
                return res.status(404).send();
            }
            res.status(200);
            res.send(user);
        }
        catch (e) {
            res.status(500);
            res.send(e);
        }
    }
});

app.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            return res.status(404).send({"error": "There is no user to delete"});
        }
        res.status(200);
        res.send(user);
    }
    catch (e) {
        res.status(500);
        res.send(e);
    }
});

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201);
        res.send(task);
    }
    catch (e) {
        res.status(400);
        res.send(e);
    };
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200);
        res.send(tasks);
    }
    catch (e) {
        res.status(500);
        res.send(e);
    };
});

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        };
        res.status(200);
        res.send(task);
    }
    catch (e) {
        res.status(500);
        res.send(e);
    };
});

app.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    const addlowedFields = ["description", "completed"];
    const fieldsFromRequest = Object.keys(req.body);

    const isOperationValid = fieldsFromRequest.every((fieldFromRequest) => {
        return addlowedFields.includes(fieldFromRequest);
    });

    if (!isOperationValid) {
        return res.status(400).send({ "error": "This field is not allowed to update." });
    }
    else {

        try {
            const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
            if (!task) {
                return res.status(404).send();
            }
            res.status(200);
            res.send(task);
        }
        catch (e) {
            res.status(500);
            res.send(e);
        }
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            return res.status(404).send({"error": "There is no task to delete"});
        }
        res.status(200);
        res.send(task);
    }
    catch (e) {
        res.status(500);
        res.send(e);
    }
});


app.listen(port, () => {
    console.log("Server is running on port " + port);
})