const express = require('express');
const router = express.Router();
const { updateRoutineActivity, getRoutineActivityById } = require('../db')
const jwt = require('jsonwebtoken');

// PATCH /api/routine_activities/:routineActivityId

router.patch('/:routineActivityId', async (req, res, next) => {

    const { count, duration } = req.body;
    const { routineActivityId } = req.params;
    const auth = req.header("Authorization");
    console.log(routineActivityId);
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
            let getRoutine = await getRoutineActivityById(routineActivityId);
            console.log(getRoutine);
            if (id === getRoutine.id) {
                getRoutine = await updateRoutineActivity({ id: routineActivityId, count, duration });
                res.send(getRoutine);
            } else {
                res.status(403).send({
                    error: "Error",
                    message: `User ${username} is not allowed to update In the evening`,
                    name: "Error"
                })
            }

        } catch (error) {
            throw error;
        }
    }

});



// DELETE /api/routine_activities/:routineActivityId

module.exports = router;
