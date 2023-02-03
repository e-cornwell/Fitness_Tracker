const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

const allRoutines = `
SELECT routines.*, count, duration, activities.name as "activityName", activities.id as "activityId", description, username as "creatorName",routine_activities.id AS "routineActivityId"
FROM routines
JOIN routine_activities ON routines.id = routine_activities."routineId"
JOIN activities ON activities.id = routine_activities."activityId"
JOIN users ON "creatorId" = users.id
`;

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
 try {
  const { rows } = await client.query(`
    SELECT *
    FROM routines
  `)
  return rows;
 } catch (error) {
  throw error;
 }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(allRoutines)
    let routines = attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    
    return routines;
  } catch (error) {
    throw error
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    ${allRoutines}
    WHERE "isPublic" = true;
    `)
    
    let routines = attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines.filter(routine => {
      if(routine.isPublic){
        return routine;
      };
    });
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
      ${allRoutines}
      WHERE username = $1
    `, [username]);
    let routines = attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;
  } catch (error) {
    throw error;
  }
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
