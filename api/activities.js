const express = require("express");
const router = express.Router();
const { getAllActivities, createActivity } = require("../db");
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
  try {
    const newActivity = await createActivity(req.body);
    console.log(newActivity);

    if (newActivity.name !== undefined) {
      res.send(newActivity);
    }
    res.send({
      error: "Any<String>",
      message: `An activity with name ${req.body.name} already exists`,
      name: "Any<String>"
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId

// GET /api/activities/:activityId/routines

module.exports = router;
