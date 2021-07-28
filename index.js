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

app.get('/prova', async (req, res) => {
    const client = await db.connect();
    res.send(200);
});