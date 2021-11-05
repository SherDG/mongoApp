const express = require("express");
const multer = require('multer');
const router = new express.Router();
const User = require('../models/users');
const auth = require('../middleware/auth');
const e = require("express");
const getStream = require('get-stream');
const sharp = require('sharp');
const {sendWelcomeEmail, sendCancelEmail} = require('../mails/account');
//API KEY - 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
const upload = multer({
    dest: 'avatars/',
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('File must be a jpg,jpeg or png'))
        }
        cb(undefined, true)
        // callback(new Error('File must be a JPG'))
    }
});

// router.get('/test',(req,res)=>{
//     res.send('Check router!')
// })


//CREATE USER
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.createToken();
        res.status(201);
        // res.send(user);
        res.send({ user, token });
    }
    catch (e) {
        res.status(400);
        res.send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.createToken();
        res.status(200);
        // res.send(user);
        res.send({ user, token });
    }
    catch (e) {
        res.status(400);
        res.send(e);
    }
});

router.post('/users/loginPrivate', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.createToken();
        res.status(200);
        // res.send(user);
        // res.send({ user: user.getPublicProfile(), token });
        res.send({ user, token });
    }
    catch (e) {
        res.status(400);
        res.send(e);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    // req.user.avatar = req.file.buffer;
    req.user.avatar = buffer;
    await req.user.save();
    // res.status(200);
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }
    catch(e){
        res.status(404).send();
    }
    await req.user.save();
    res.send();
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.get('/users', auth, async (req, res) => {
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

router.get('/users/me', auth, async (req, res) => {
    res.status(200);
    res.send(req.user); // req.user from middleware/auth.js
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        // console.log(req.user.tokens);
        req.user.tokens = req.user.tokens.filter((token => {
            return token.token !== req.token; //if false remove token
        }));
        await req.user.save();
        // res.status(200);
        res.send({ message: "You are logged out!" });
        // res.send();
    }
    catch (e) {
        res.status(500);
        res.send(e);
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        console.log(req.user.tokens);
        req.user.tokens = [];
        await req.user.save();
        // res.status(200);
        res.send({ message: "You are logged out from all sessions!" });
        // res.send();
    }
    catch (e) {
        res.status(500);
        res.send(e);
    }
});

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/me', auth, async (req, res) => {

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
            fieldsFromRequest.forEach((fieldFromRequest) => req.user[fieldFromRequest] = req.body[fieldFromRequest]);
            await req.user.save();
            res.status(200);
            res.send(req.user);
        }
        catch (e) {
            res.status(500);
            res.send(e);
        }
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        // console.log(req.user);
        await req.user.remove();
        sendCancelEmail(req.user.email, req.user.name);
        res.status(200);
        res.send(req.user);
    }
    catch (e) {
        res.status(500);
        res.send(e);
    }
});

// router.patch('/users/:id', async (req, res) => {
//     const _id = req.params.id;

//     const addlowedFields = ["name", "age", "password", "email"];
//     const fieldsFromRequest = Object.keys(req.body);

//     const isOperationValid = fieldsFromRequest.every((fieldFromRequest) => {
//         return addlowedFields.includes(fieldFromRequest);
//     });

//     if (!isOperationValid) {
//         return res.status(400).send({ "error": "This field is not allowed to update." });
//     }
//     else {

//         try {
//             // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
//             const user = await User.findById(req.params.id);
//             fieldsFromRequest.forEach((fieldFromRequest) => user[fieldFromRequest] = req.body[fieldFromRequest]);
//             await user.save();

//             if (!user) {
//                 return res.status(404).send();
//             }
//             res.status(200);
//             res.send(user);
//         }
//         catch (e) {
//             res.status(500);
//             res.send(e);
//         }
//     }
// });

// router.delete('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findByIdAndDelete(_id);
//         if (!user) {
//             return res.status(404).send({ "error": "There is no user to delete" });
//         }
//         res.status(200);
//         res.send(user);
//     }
//     catch (e) {
//         res.status(500);
//         res.send(e);
//     }
// });




module.exports = router;