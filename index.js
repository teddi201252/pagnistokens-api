const express = require('express');
const app = express();
const mysql = require('mysql2');
const PORT = process.env.PORT;

const welcomePage = '/pagnistokens/';
const usersPage = '/pagnistokens/users';
const getUserPage = '/pagnistokens/users/:id';
const getWalletPage = '/pagnistokens/wallets/:id';
const getUserByWalletPage = '/pagnistokens/users/walletid/:walletId';
const notificationsPage = '/pagnistokens/notifications';
const friendshipIsMagicPage = '/pagnistokens/friends';

/*
ERRORS LIST

466 = bad json parsing
420 = bad query

*/

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

app.get(usersPage, function (req, res) {
  const connection = mysql.createConnection(dbConfig);
  connection.connect();
  connection.query('SELECT * from Users', function(err, rows, fields){
    if(err){
      res.status(420).send(err);
    } 
    else{
      res.send(rows);
    }
  });
  connection.end();
});

app.get(getUserPage, (req, res) => {
  try {
    const { id } = req.params;
    const values = [ id ];
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    connection.query('SELECT username, walletid from Users WHERE id = ?', values, function(err, rows, fields){
      if(err){
        res.status(420).send(err);
      } 
      else{
        res.send(rows[0]);
      }
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
      res.status(420).send(err);
    } 
    else {
      res.send(rows[0]);
    }
   
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
      res.status(420).send(err);
    } 
    else{
      res.send(rows[0]);
    }
  });
  connection.end();
});

app.post(notificationsPage, (req, res) => {
  try {
    const {idUser, title, message} = req.body;
    const values = [idUser, title, message];
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    connection.query('INSERT INTO Notifications (idUser, title, message) VALUES (?, ?, ?)', values, (err, rows, fields) => {
      if(err){
        res.status(420).send(err);
      }
      else{
        res.send(rows);
      }
    });
    connection.end();
  }
  catch(err){
    res.status(466).send("Something's wrooong i can feel it " + err)
  }
});

app.route(friendshipIsMagicPage)
  .post((req, res) => {
    try {
      const { id1, id2 } = req.body;
      const values = [id1, id2];
      const connection = mysql.createConnection(dbConfig);
      connection.connect();
      connection.query('INSERT INTO FriendRelations (id1, id2) VALUES (?, ?)', values, (err, rows, fields) => {
        if(err){
          res.status(420).send(err);
        }
        else{
          res.send(rows);
        }
      });
      connection.end();
    } 
    catch(err){
      res.status(466).send("Something's wrooong i can feel it " + err)
    }
  })
  .put((req, res) => {
    try {
      const {id1, id2} = req.body;
      const values = [id1, id2];
      const connection = mysql.createConnection(dbConfig);
      connection.connect();
      connection.query('UPDATE FriendRelations SET accepted = true WHERE id1 = ? AND id2 = ?', values, (err, rows, fields) => {
        if(err){
          res.status(420).send(err);
        }
        else{
          res.send(rows);
        }
      });
      connection.end();
    }catch(err){
      res.status(466).send("Something's wrooong i can feel it " + err)
    }
  })
  .delete((req, res) => {
    try {
      const {id1, id2} = req.body;
      const values = [id1, id2];
      const connection = mysql.createConnection(dbConfig);
      connection.connect();
      connection.query('DELETE FROM FriendRelations WHERE id1 = ? AND id2 = ?', values, (err, rows, fields) => {
        if(err){
          res.status(420).send(err);
        }
        else{
          res.send(rows);
        }
      });
      connection.end();
    }catch(err){
      res.status(466).send("Something's wrooong i can feel it " + err)
    }
  });