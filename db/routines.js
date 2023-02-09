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

//When is this used? This function is not tested. 
async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
      SELECT * FROM routines
      WHERE id = $1
    `, [id])
    return routine;
  } catch (error) {
    throw error;
  }
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
  try {
    const { rows } = await client.query(`
    ${allRoutines}
    WHERE username = $1 AND "isPublic" = true;
    `, [username])
    let routines = attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    //console.log(routines)
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(`
    ${allRoutines}
    WHERE "activityId" = $1 AND "isPublic" = true;
    `, [id])
    let routines = attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setFields = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
    
  try {
    const { rows: [routine] } = await client.query(`
      UPDATE routines
      SET ${setFields}
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return routine;
  } catch (error){
    throw error;
  }  
}

async function destroyRoutine(id) {
  try {
    //don't need a variable for this one. We're just deleting it.
    await client.query(`
      DELETE FROM routine_activities
      WHERE "routineId" = $1
    `, [id])
    //Need variable to return the routine only
    const { rows: [routine] } = await client.query(`
      DELETE FROM routines
      WHERE id = $1
    `, [id])
    
    return {routine}

  } catch (error) {
    throw(error)
  }
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
