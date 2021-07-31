const express = require('express');
const app = express();
const mysql = require('mysql2');
const PORT = process.env.PORT;

const welcomePage = '/pagnistokens/';
const usersUnavailablePage = '/pagnistokens/users';
const usersPage = '/pagnistokens/users/:id';

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

app.use(express.json());

app.listen(PORT, () => console.log('Connected in ' + PORT));

app.get(welcomePage, function (req, res) {
  const connection = mysql.createConnection(dbConfig);
  connection.connect();
  connection.query("SELECT * from 'users'", function(err, rows, fields){
    if(err){
      throw err;
    } 
    res.send(rows);
  });
  connection.end();
});

app.get(usersUnavailablePage, function (req, res) {
  res.status(417).send('This page doesn\'t do anything.').send({});
});

app.get(usersPage, (req, res) => {
  try {
    const { id } = req.params;
    const values = [ id ];
    const result = {'id': id, 'name': 'Bellissimo'};
    res.send(result);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});