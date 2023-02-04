const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows } = await client.query(`
      INSERT INTO routine_activities ("routineId", "activityId", count, duration) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT ("routineId", "activityId") DO NOTHING
      RETURNING *;
    `, [routineId, activityId, count, duration]);
    const [routineActivity] = rows;
    return routineActivity;
  } catch (error) {
    throw error
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [routineActivity]} = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id=${ id }
    `)
    return routineActivity;
  } catch (error) {
    
  }

}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: activities } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE "routineId"=${ id }
    `);

    return activities;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {

  const setFields = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
    
  try {
    const { rows: [routine_activities] } = await client.query(`
      UPDATE routine_activities
      SET ${setFields}
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return routine_activities;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
try {
  const { rows: [routineActivity] } = await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId"=${ id }
    RETURNING *
    `)
  return routineActivity;
} catch (error) {
  throw error;
}
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
