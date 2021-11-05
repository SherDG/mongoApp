// start DB on Linux --> sudo systemctl start mongod 
// start DB on Mac --> - brew services start mongodb-community@5.0
// Stop - brew services stop mongodb-community@5.0

//HEROKU
// git add --> commit --> push
// git push heroku appMain:main


const express = require("express");
require('./db/mongoose');
const app = express();
const routerUser = require('./routs/user');
const routerTask = require('./routs/tasks');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        // if (!file.originalname.endsWith('.pdf')) {
        //     return callback(new Error('File must be a JPG'))
        // }
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return callback(new Error('File must be a doc or docx'))
        }
        callback(undefined, true)
        // callback(new Error('File must be a JPG'))
    }
});

const port = process.env.PORT

// MIDDLEWARE -> used before router
// app.use((req,res, next)=>{
//     console.log(req.method, req.path);
//     res.status(503);
//     res.send("MAINTENANCE MODE!");
//     next();
// });

//ERROR middleware
const errorMiddleware = (req, res, next) => {
    throw new Error("Error from custom middleware!")
}

//CHECK UPLOAD
app.post('/upload', upload.single('upload'), (req, res) => {
    res.status(200);
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

// app.post('/upload', errorMiddleware, (req, res) => {
//     res.status(200);
//     res.send();
// },(error, req,res,next)=>{
//     res.status(400).send({error:error.message})
// });

app.use(express.json());
app.use(routerUser);
app.use(routerTask);

app.listen(port, () => {
    console.log("Server is running on port " + port);
});

const Task = require('./models/tasks');
const User = require('./models/users');

// const main = async () => {
//     // const task = await Task.findById('617bfaf6c9b9b79f80f4a7ec').populate('owner').exec();
//     // console.log(task.owner);   


//     // const user = await User.findById('617bf5721a06500b65b3bac6').populate('tasks').exec();
//     // console.log(user.tasks);
// }
// main();