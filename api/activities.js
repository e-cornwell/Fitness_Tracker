const express = require("express");
const router = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity
} = require("../db");
const jwt = require("jsonwebtoken");

// GET /api/activities

router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    console.log(error);
  }
});

// POST /api/activities

router.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  const auth = req.header("Authorization");
  try {
    if (!auth) {
      res.send({
        error: "Error",
        message: "You must be logged in to perform this action",
        name: "Error",
      });
    } else {
      try {
        const newActivity = await createActivity({ name, description });
        res.send(newActivity);
      } catch (error) {
        res.send({
          error: "Error",
          message: `An activity with name ${name} already exists`,
          name: "Error",
        });
      }
    }
  } catch (error) {
    throw error;
  }
});

// PATCH /api/activities/:activityId

router.patch("/:activityId", async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  const auth = req.header("Authorization");
  try {
    if (!auth) {
      res.send({
        error: "Error",
        message: "You must be logged in to perform this action",
        name: "Error",
      });
    } else {
      try {
        const activityUpdate = await updateActivity({ id: activityId, name, description });
        if (!activityUpdate) {
          res.send({
            error: "Error",
            message: `Activity ${activityId} not found`,
            name: "Error"
          });
        } else {
          res.send(activityUpdate);
        }
      } catch (error) {
        res.send({
          error: "Error",
          message: `An activity with name ${name} already exists`,
          name: "Error",
        });
      }
    }
  } catch (error) {
    throw error;
  }
});

// GET /api/activities/:activityId/routines

router.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  const publicRoutines = await getPublicRoutinesByActivity({id: activityId});
  
  // console.log(publicRoutines);
  // console.log(activityId);
  // console.log(publicRoutines[0].activities[0].id);
  console.log(publicRoutines[0].activities[0]);
  

  try {
    if (!publicRoutines[0].activities[0]) {
      res.send({
        error: "Error",
        message: `Activity ${activityId} not found`,
        name: "Error"
      });
    } else {
      res.send(publicRoutines);
    }
  } catch (error) {
    throw error
  } 
});

module.exports = router;