// start DB on Linux --> sudo systemctl start mongod 
// start DB on Mac --> - brew services start mongodb-community@5.0
// Stop - brew services stop mongodb-community@5.0

require('./src/db/mongoose');
const Task = require('./src/models/tasks');

const deleteStausAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: false});
    return count;
};

deleteStausAndCount("61701c60526aa1fc76389954").then((result)=>{
    console.log(result);
}).catch((e)=>{
    console.log(e);
})
