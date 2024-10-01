const pgPromise = require("pg-promise"); //import pg-promise library
const bcrypt = require("bcrypt") // to hash the password
const saltRounds = 10 // Define the number of salt rounds for bcrypt
const passwordServer = process.env.PASSWORD_SERVER 
const db = pgPromise()(`postgres://postgres:${passwordServer}@35.180.135.186:6000/postgres`); //Connect to the postgreSQL database using the connection string

const passwordDB = process.env.PASSWORD_DB_EXAMPLE
async function setupDB() {
  //Drop the 'users' table if it exixt and create a new 'users' table
  await db.none(`
      DROP TABLE IF EXISTS users;
      CREATE TABLE users
      (id SERIAL PRIMARY KEY,
      firstname VARCHAR(30) NOT NULL,
      lastname VARCHAR(30) NOT NULL,
      username VARCHAR(30) NOT NULL,
      email VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL,
      image VARCHAR(255)
      );
        `);


  // Hash the password before inserting into the db
  const hashedPassword = await bcrypt.hash(passwordDB, saltRounds)

  // Insert a new user into the 'users' table
  await db.none(
    `INSERT INTO users (firstname, lastname, username, email, password, image) VALUES ('cinthya', 'redondo soto', 'ciincin', 'cinthya@gmail.com', $1, '../assets/foto-cv-CinthyaRS.jpg')`, [hashedPassword]
  );

  //Select all users from the 'users' table
  const users = await db.many(`SELECT * FROM users`);

  //log the retrieved users to the console
  console.log(users);
}

//Execute the setupDB function to set up the database
setupDB();

module.exports = db;
