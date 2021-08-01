const express = require('express');
const app = express();
const mysql = require('mysql2');
const PORT = process.env.PORT;

const welcomePage = '/pagnistokens/';
const usersUnavailablePage = '/pagnistokens/users';
const usersPage = '/pagnistokens/users/:id';
const getWalletPage = '/pagnistokens/wallets/:id';
const getUserByWalletPage = '/pagnistokens/users/walletid/:walletId';

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
  res.send('Hello there');
});

app.get(usersUnavailablePage, function (req, res) {
  const connection = mysql.createConnection(dbConfig);
  connection.connect();
  connection.query('SELECT * from Users', function(err, rows, fields){
    if(err){
      res.send(err);
    } 
    res.send(rows);
  });
  connection.end();
});

app.get(usersPage, (req, res) => {
  try {
    const { id } = req.params;
    const values = [ id ];
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    connection.query('SELECT username, walletid from Users WHERE id = ?', values, function(err, rows, fields){
      if(err){
        res.send(err);
      } 
      res.send(rows[0]);
    });
  connection.end();
  } catch (err) {
    res.send("Error " + err);
  }
});

app.get(getWalletPage, (req, res) => {
  const { id } = req.params;
  const values = [ id ];
  const connection = mysql.createConnection(dbConfig);
  connection.connect();
  connection.query('SELECT * from Wallets WHERE id = ?', values, function(err, rows, fields){
    if(err){
      res.send(err);
    } 
    res.send(rows[0]);
  });
  connection.end();
});

app.get(getUserByWalletPage, (req, res) => {
  const { walletId } = req.params;
  const values = [ walletId ];
  const connection = mysql.createConnection(dbConfig);
  connection.connect();
  connection.query('SELECT * from Users WHERE walletid = ?', values, function(err, rows, fields){
    if(err){
      res.send(err);
    } 
    res.send(rows[0]);
  });
  connection.end();
});