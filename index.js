const express = require('express');
const app = express();
const pg = require('pg');
const PORT = process.env.PORT || 5000;

const connectionPG = process.env.DATABASE_URL;
const pgClient = new pg.Client(connectionPG);
pgClient.connect();

app.listen(PORT, () => console.log('Connected'));

app.get('/prova', (req, res) => {
    res.sendStatus(200);
});