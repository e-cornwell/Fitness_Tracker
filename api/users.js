/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const { getUserByUsername, createUser, getUser, getPublicRoutinesByUser, getAllRoutinesByUser } = require('../db')
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

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        next({
            name: "userPassIncorrect",
            message: "Username or Password is incorrect"
        });  
    }

    try {
        const user = await getUser({username, password}); //To get username and password but does not return id
        const User = await getUserByUsername(username) //To grab id
        
        if (user) {
            const token = jwt.sign({ id: User.id, username}, process.env.JWT_SECRET);

            res.send({
                user: {id: User.id, username},
                message: "you're logged in!",
                token
            });
        } else {
            res.send({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }

    } catch (error) {
       throw error;
    }
});

// GET /api/users/me


// GET /api/users/:username/routines

usersRouter.get('/:username/routines', async (req, res, next) => {
    const { username } = req.params;
    const token = req.header("Authorization").slice(7);
    const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
    const allRoutines = await getAllRoutinesByUser({username});
    const publicRoutines = await getPublicRoutinesByUser({username});
    
    try {
        if(username === tokenVerify.username) {
            res.send(allRoutines);
        } else {
            res.send(publicRoutines);
        }

    } catch (error) {
       throw error; 
    }


    
});


module.exports = usersRouter;
