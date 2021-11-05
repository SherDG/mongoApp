
const mongoose = require("mongoose");
const validator = require("validator");
const url = 'mongodb://localhost:27017/task-manager-api';


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const user = mongoose.model('User', {
    name:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: 7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("Password cannot contain 'password'!");
            }

        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid!");
            }

        }
    },
    age: {
        type: Number,
        required: true,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("Age must be a positive number!");
            }

        }
    }
});

const testUser = new user({
    name: "Dima",
    password: "gfgf4324",
    email: "fdsf@fds.com",
    age: 34
});

testUser.save().then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(error);
})