const express = require('express');
const app = express();
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

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await db.connect();
    const values = [ id ];
    const result = safeQuery('SELECT * FROM "users" WHERE id = $1', values);
    const results = { 'results': (result) ? result.rows : null};
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

function safeQuery(text, values){
  await client.query(text, values, (err, res)=>{
    if (err) {
      console.log(err.stack);
    } else {
      return res.rows;
    }
  });
}