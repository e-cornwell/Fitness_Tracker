const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

//database functions

//user functions
async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING username, id
    `,
      [username, hashedPassword]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  let passwordsMatch = await bcrypt.compare(password, hashedPassword);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT username
      FROM users
      WHERE username=$1 AND password=$2;
    `,
      [username, hashedPassword]
    );

    if (passwordsMatch) {
      return user;
    } else {
      console.log("password does not match");
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT id, username
    FROM users
    WHERE id=${userId}
  `);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [userName]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
