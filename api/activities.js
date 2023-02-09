const express = require('express');
const router = express.Router();
const { getAllActivities } = require('../db')
const jwt = require('jsonwebtoken');

// GET /api/activities

router.get('/', async(req, res, next) => {
    
    const activities = await getAllActivities();
    res.send(activities);

});

// GET /api/activities/:activityId/routines

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
