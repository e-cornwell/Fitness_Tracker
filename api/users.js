/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const { getUserByUsername, createUser } = require('../db')
const jwt = require('jsonwebtoken');

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const _user = await getUserByUsername(username);
        const user = await createUser({ username, password });
        //console.log(user)
        
        if (_user) {
            res.send({
                error: "An Error Message",
                name: "UserAlreadyExistError",
                message: `User ${username} is already taken.`
                //ARE YOU KIDDING ME!!!! VERY CLEVER FULLSTACK!^
            });

        } else if (password.length < 8){
            res.send({
                error: "An Error Message",
                name: "PasswordMustBeGreaterThenEightCharacters",
                message: "Password Too Short!"
            });
        } else {
            const token = jwt.sign({ id: user.id, username: user.username}, process.env.JWT_SECRET);
            res.send({ user, message: "User created", token });
            //console.log({ user, message: "User created", token })
        } 

    } catch (error) {
        throw error;
    }
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;
