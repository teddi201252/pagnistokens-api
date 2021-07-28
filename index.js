const express = require('express');
const app = express();
const pg = require('pg');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.listen(PORT, () => console.log('Connected'));

app.get('/', function (req, res) {
  res.send('Hello there');
});

app.get('/prova', async (req, res) => {
  try {
    const client = await db.connect();
    const result = await client.query("SELECT * FROM 'pgAdmin_test'");
    const results = { 'results': (result) ? result.rows : null};
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
}
});