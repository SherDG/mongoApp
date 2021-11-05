// start DB on Linux --> sudo systemctl start mongod 
// start DB on Mac --> - brew services start mongodb-community@5.0
// Stop - brew services stop mongodb-community@5.0

require('./src/db/mongoose');
const Task = require('./src/models/tasks');

const updateStausAndCount = async (id, completed) => {
    const task = await Task.findByIdAndUpdate(id, {completed});
    const count = await Task.countDocuments({completed});
    return count;
}

// Task.findByIdAndDelete("61701c6f0086b0d181f06f2d").then((task)=>{
//     console.log(task);
//     return Task.countDocuments({completed: false})
// }).then((result)=>{
//     console.log(result);
// }).catch((e)=>{
//     console.log(e);
// });

updateStausAndCount("6172b1bbb6b3eba96bd9dd66", false).then((result)=>{
    console.log(result);
}).catch((e)=>{
    console.log(e);
})
