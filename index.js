const express = require('express');
const app = express();
const pg = require('pg');
const PORT = process.env.PORT || 5000;

const connectionPG = "postgres://uztocliqrifgod:9e12c387cd75a910b5471e414a394c0766a2cc188dc2c9ba7459e0023a727291@ec2-52-6-211-59.compute-1.amazonaws.com:5432/d9i98rskf7476v"
const pgClient = new pg.Client(connectionPG);
pgClient.connect();

app.listen(PORT, () => console.log('Connected'));

app.get('/prova', (req, res) => {
    res.sendStatus(200);
});