const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {
    // console.log(req.method, req.path, "check middleware");
    // res.status(503);
    // res.send("MAINTENANCE MODE!");
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        // console.log(user);
        // console.log(token);
        if(!user){
            throw new Error()
        }

        req.token = token;
        req.user = user;
        next();
    }
    catch (e) {
        res.status(401);
        res.send({ error: "Please make auth!" });
    }
   
};


module.exports = auth;