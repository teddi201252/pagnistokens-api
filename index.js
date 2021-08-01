const express = require('express');
const app = express();
const mysql = require('mysql2');
const PORT = process.env.PORT;

const getUserNickPage = '/pagnistokens/users/@:username';
const getUserPage = '/pagnistokens/users/:id';
const getWalletPage = '/pagnistokens/wallets/:id';
const paySomeonePage = '/pagnistokens/wallets';
const getUserByWalletPage = '/pagnistokens/users/walletid/:walletId';
const notificationsPage = '/pagnistokens/notifications';
const friendshipIsMagicPage = '/pagnistokens/friends';
const getFriendshipIsMagicPage = '/pagnistokens/friends/:id';

/*
ERRORS LIST

466 = bad json parsing
420 = bad query
421 = not enough money

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

app.get(getUserNickPage, (req, res) => {
  try {
    const { username } = req.params;
    const values = [ '%' + username + '%' ];
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    connection.query('SELECT id, username, walletid from Users WHERE username LIKE ?', values, function(err, rows, fields){
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

app.get(getUserPage, (req, res) => {
  try {
    const { id } = req.params;
    const values = [ id ];
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    connection.query('SELECT id, username, walletid from Users WHERE id = ?', values, function(err, rows, fields){
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
  try {
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
  } catch (err) {
    res.send("Error " + err);
  }
});

app.put(paySomeonePage, (req, res) => {
  try {
    const { amount, sender, receiver } = req.body;
    const connection = mysql.createConnection(dbConfig);
    connection.connect();

    //Check if sender have enough money
    var money = 1;
    var values = [sender];
    connection.query('SELECT * FROM Wallets WHERE id = ?', values, function(err, rows, fields){
      if(err){
        res.status(420).send(err.message);
        connection.end();
      } 
      money = rows[0].balance;
      if(money - amount >= 0){ //If enough money, make updates
        values = [amount, sender];
        connection.query('UPDATE Wallets SET balance = balance - ? WHERE id = ?', values, function(err, rows, fields){
          if(err){
            res.status(420).send(err.message);
          }
        });
        values = [amount, receiver];
        connection.query('UPDATE Wallets SET balance = balance + ? WHERE id = ?', values, function(err, rows, fields){
          if(err){
            res.status(420).send(err.message);
          }
          else{
            res.send({message: "Good Transaction"});
          }
        });
      }else{
        res.status(421).send({message: "Not enough money"});
      }
      
      connection.end();
    });


  } catch (err) {
    res.send("Error " + err);
  }
});

app.get(getUserByWalletPage, (req, res) => {
  try {
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
  } catch (err) {
    res.send("Error " + err);
  }
});

app.route(notificationsPage)
  .get((req, res) => {
    try {
      const id = req.get('id');
      const values = [id];
      const connection = mysql.createConnection(dbConfig);
      connection.connect();
      connection.query('SELECT * FROM Notifications WHERE idUser = ?', values, (err, rows, fields) => {
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
  .post((req, res) => {
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
  })
  .delete((req, res) => {
    try {
      const { id } = req.body;
      const values = [id];
      const connection = mysql.createConnection(dbConfig);
      connection.connect();
      connection.query('DELETE FROM Notifications WHERE id = ?', values, (err, rows, fields) => {
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

app.get(getFriendshipIsMagicPage, (req, res)=>{
  try {
    const { id } = req.params;
    const values = [id, id];
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    connection.query('SELECT * FROM FriendRelations WHERE id1 = ? OR id2 = ?', values, (err, rows, fields) => {
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