const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES($1, $2, $3, $4)
      RETURNING *
      `, [creatorId, isPublic, name, goal])

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {

}

async function getRoutinesWithoutActivities() {
 
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, count, duration, activities.name as "activityName", routine_activities.id AS "routineActivityId", activities.id AS "activityId", description, username AS "creatorName" 
    FROM routines
      JOIN routine_activities ON routines.id = routine_activities."routineId"
      JOIN activities ON activities.id = routine_activities."activityId"
      JOIN users ON routines."creatorId" = users.id
    `)
    let routines = attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    console.log(rows);
    return routines;
  } catch (error) {
    throw error
  }
}

async function getAllPublicRoutines() {

}

async function getAllRoutinesByUser({ username }) {

}

async function getPublicRoutinesByUser({ username }) {

}

async function getPublicRoutinesByActivity({ id }) {

}

async function updateRoutine({ id, ...fields }) {

}

async function destroyRoutine(id) {

}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
