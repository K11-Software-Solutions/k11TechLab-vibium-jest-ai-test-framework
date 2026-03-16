// Node.js script to create sample_db.sqlite from sample_db.sql
const fs = require(`fs`);
const sqlite3 = require(`sqlite3`).verbose();
const path = require(`path`);

const dbPath = path.join(__dirname, `sample_db.sqlite`);
const sqlPath = path.join(__dirname, `sample_db.sql`);

const sql = fs.readFileSync(sqlPath, `utf8`);
const db = new sqlite3.Database(dbPath);

db.exec(sql, (err) => {
  if (err) {
    console.error(`Error creating SQLite DB:`, err.message);
    process.exit(1);
  } else {
    console.log(`sample_db.sqlite created successfully.`);
    db.close();
  }
});
