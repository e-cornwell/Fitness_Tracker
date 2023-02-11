const express = require('express');
const routinesRouter = express.Router();
const { addActivityToRoutine, createRoutine, getAllPublicRoutines, getUserById, getRoutineById, updateRoutine, destroyRoutine } = require('../db')
const jwt = require('jsonwebtoken');

// GET /api/routines

routinesRouter.get('/', async (req, res, next) => {

    const routines = await getAllPublicRoutines();
    res.send(routines);

});

// POST /api/routines

routinesRouter.post('/', async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    const auth = req.header("Authorization");

    try {
        if (!auth) {
            res.send({
                error: "Error",
                message: "You must be logged in to perform this action",
                name: "Error"
            });
        } else {
            const token = auth.slice(7);
            const user = jwt.verify(token, process.env.JWT_SECRET);
            const creatorId = user.id;
            const newRoutine = await createRoutine({
                creatorId,
                isPublic,
                name,
                goal
            });
            res.send(newRoutine);
        }

    } catch (error) {
        throw error;
    }

});

// PATCH /api/routines/:routineId

routinesRouter.patch('/:routineId', async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    const { routineId } = req.params;
    const auth = req.header("Authorization");

    if (!auth) {
        res.send({
            error: "Error",
            message: "You must be logged in to perform this action",
            name: "Error"
        });
    } else if (auth) {
        const token = auth.slice(7);
        try {
            const { id, username } = jwt.verify(token, process.env.JWT_SECRET);
            let getRoutine = await getRoutineById(routineId);

            if (id === getRoutine.creatorId) {
                getRoutine = await updateRoutine({ id: routineId, isPublic, name, goal });
                res.send(getRoutine);
            } else {
                res.status(403).send({
                    error: "Error",
                    message: `User ${username} is not allowed to update Every day`,
                    name: "Error"
                })
            }

        } catch (error) {
            throw error;
        }
    }
});

// DELETE /api/routines/:routineId

routinesRouter.delete('/:routineId', async (req, res, next) => {
    try {
        const { routineId } = req.params;
        const auth = req.header("Authorization");

        if (!auth) {
            res.send({
                error: "Error",
                message: "You must be logged in to perform this action",
                name: "Error"
            });
        } else {
            const token = auth.slice(7);
            const { id, username } = jwt.verify(token, process.env.JWT_SECRET);
            const getRoutine = await getRoutineById(routineId);

            if (id === getRoutine.creatorId) {
                await destroyRoutine(getRoutine.id);
                res.send(getRoutine);
            } else {
                res.status(403).send({
                    error: "Error",
                    message: `User ${username} is not allowed to delete On even days`,
                    name: "Error"
                })
            }
        }
    } catch (error) {
        throw error;
    }
});

// POST /api/routines/:routineId/activities

routinesRouter.post('/:routineId/activities', async (req, res, next) => {
    const { activityId, count, duration } = req.body;
    const { routineId } = req.params;
    const addActivity = await addActivityToRoutine({ routineId, activityId, count, duration });

    if (addActivity) {
        res.send(addActivity);
    } else {
        try {
            res.send({
                error: "Error",
                message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
                name: "Error"
            })
        } catch (error) {
            throw error
        }
    }

});

module.exports = routinesRouter;
