const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}

const generateUser = async (req, res) => {
    try {
        const {name, email, password, phone, role} = req.body;
        if (!name || !email || !password) {
            res.status(400).json({message : 'Please enter all required fields'});
            return;
        }

        const userExits = await User.findOne({email});
        if(userExits) {
            res.status(400).json({message : 'User already exists'});
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            phone,
            role
        });

        if(user) {
            res.status(201).json({
                _id : user._id,
                name : user.name,
                email : user.email,
                phone : user.phone,
                role : user.role,
                token : generateToken(user._id.toString())
            });
        }
        else {
            res.status(400).json({message : 'Invalid user data'});
        }
    }
    catch(error) {
        console.error(error);
        res.status(400).json({message : error.message});
    }
}

const loginUser = async (req, res) => {
    try{
        const {password, email} = req.body;
        if(!email || !password) {
            res.status(400).json({message : 'Please provide email and password'});
            return;
        }

        const user = await User.findOne({email});
        if(!user) {
            res.status(401).json({message : 'Invalid email or password'});
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password || "");
        if(!isMatch) {
            res.status(401).json({message : 'Invalid email or password'});
            return;
        }

        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            phone : user.phone,
            role : user.role,
            token : generateToken(user._id.toString())
        });
    }
    catch(error) {
        console.error(error);
        res.status(400).json({message : error.message});
    }
}

const getMe = async (req, res) => {
    try{
        if(!req.user) {
            res.status(401).json({message : 'Not Authorized'});
            return;
        }
        res.json(req.user);
    }
    catch(error) {
        console.error(error);
        res.status(400).json({message : error.message});
    }
}

module.exports = {
    generateUser,
    loginUser,
    getMe
}