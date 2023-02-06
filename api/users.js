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
        if (!user) {
            next({
                name: "UserNotCreated",
                message: "User not created"
            });
        } else if (_user) {
            next({
                name: "UserAlreadyExists",
                message: "User already exists"
            });
        } else if (password.length < 8){
            next({
                name: "PasswordMustBeGreaterThenEightCharacters",
                message: "Password must be greater then eight characters"
            });
        } else {
            const token = jwt.sign({ id: user.id, username: user.username}, process.env.JWT_SECRET);
            res.send({ user, message: "User created", token });
        } 

        

    } catch (error) {
    throw error;
    }

});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;
