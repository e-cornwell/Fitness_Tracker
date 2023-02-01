const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      SELECT routines.id, activities.id, count, duration
      FROM activities
      RIGHT JOIN routines
      ON activities."routineId" = routines.id
    `, [routineId, activityId, count, duration])

    return routineActivity;
  } catch (error) {
    throw error
  }
}

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
