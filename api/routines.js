const express = require('express');
const routinesRouter = express.Router();
const { createRoutine, getAllPublicRoutines, getUserById, getRoutineById, updateRoutine } = require('../db')
const jwt = require('jsonwebtoken');

// GET /api/routines

routinesRouter.get('/', async(req, res, next) => {
    
    const routines = await getAllPublicRoutines();
    res.send(routines);

});

// POST /api/routines

routinesRouter.post('/', async(req, res, next) => {
    const { isPublic, name, goal } = req.body;
    const auth = req.header("Authorization");

    try {
        if(!auth) {
            res.send({
                error: "An Error Message",
                message: "You must be logged in to perform this action",
                name: "Name"
            });
        } else {
            const token = auth.slice(7);
            const user = jwt.verify(token, process.env.JWT_SECRET);
            const creatorId = user.id;
            const newRoutine = await createRoutine({ 
                creatorId, 
                isPublic, 
                name, 
                goal });
            res.send(newRoutine);
        }

    } catch (error) {
        throw error;
    }

});

// PATCH /api/routines/:routineId

routinesRouter.patch('/:routineId', async(req, res, next) => {

    const { routineId } = req.params;
    const { isPublic, name, goal } = req.body;
    const getRoutine = await getRoutineById(routineId);
    const update = await updateRoutine({id: routineId, isPublic, name, goal })
    try {

        if(update) {
            res.send(update);
        }
        
    } catch (error) {
        throw error
    }

});

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
