const express = require('express');
const app = express();
const pg = require('pg');
const PORT = process.env.PORT || 5000;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const { Pool } = require('pg');
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


app.listen(PORT, () => console.log('Connected'));

app.get('/prova', async (req, res) => {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    res.render('index', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
}
});