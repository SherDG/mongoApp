const express = require("express");
const router = new express.Router();
const Task = require('../models/tasks');
const e = require("express");
const auth = require('../middleware/auth');
const User = require('../models/users');

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body, // ... copy all object properties
        owner: req.user._id // get from auth
    });
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

router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({});

        //TWO WAYS TO GET ALL TASKS BE USER ID
        // const tasks = await Task.find({ owner: req.user._id });


        //SORTING BY OPTION
        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            // console.log(parts);
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            // console.log(sort);
            // console.log(sort[parts[0]]);
        }


        const tasks = await Task.find({ owner: req.user._id })
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sort)
            .populate({
                path: 'User.tasks'
            }).exec(function (err, tasks) {
                try {
                    tasks = tasks.filter(function (task) {                        
                        var match = req.query.completed === 'true';
                        return task.completed === match;
                    });                    
                    res.status(200);
                    res.send(tasks);
                }
                catch (err) {
                    console.log(err)
                }
            });

        // const tasks = await Task.find({ owner: req.user._id }).populate('tasks').exec(function (err, tasks) {
        //     tasks = tasks.filter(function (task) {
        //         // console.log(req.query.completed);
        //         var match = req.query.completed === 'true';
        //         return task.completed === match;
        //     });
        //     // console.log(tasks);
        //     res.status(200);
        //     res.send(tasks);
        // });


        // res.status(200);
        // res.send(tasks);
    }
    catch (e) {
        res.status(500);
        res.send(e);
    };
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });

        // console.log(task)
        if (!task) {
            return res.status(404).send({ message: "You don't auth or this is not your task!" });
        };
        res.status(200);
        res.send(task);
        // res.send(req.user.tasks);
    }
    catch (e) {
        res.status(500);
        res.send(e);
    };
});

router.patch('/tasks/:id', auth, async (req, res) => {
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
            // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
            // const task = await Task.findById(req.params.id);
            const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

            if (!task) {
                return res.status(404).send();
            }
            fieldsFromRequest.forEach((fieldFromRequest) => task[fieldFromRequest] = req.body[fieldFromRequest]);
            await task.save();
            res.status(200);
            res.send(task);
        }
        catch (e) {
            res.status(500);
            res.send(e);
        }
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        // const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            return res.status(404).send({ "error": "There is no task to delete" });
        }
        res.status(200);
        res.send(task);
    }
    catch (e) {
        res.status(500);
        res.send(e);
    }
});

module.exports = router;