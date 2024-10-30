const { request } = require('http');
const express = require('express');
const {exec} = require('child_process');
var bodyParser=require("body-parser");
const mysql = require('mysql2');
const app = express();
let cors = require("cors");
var fs = require('fs');
// const collect = require('collect.js');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Er@5erhe@d",
    database: "database-db",
    port: "3306"
});

connection.connect((err) =>{
    if(err){
        throw err;
    } else{
        console.log("Connection Successful!");
    }
});

activeUser = null;
app.use(cors());
app.use(bodyParser.json());


app.get("/activeUserGet", function (req,res) {
    // console.log(activeUser)
    res.send(String(activeUser))
    // console.log(`Sent Active user - ${activeUser} to the function.js file`)
})

user_database = []
app.get("/getUserData", function (req,res) {
    connection.query(`Select email_id, password, user_id from users`, function (err, results, fields) {
        for(let i = 0; i<results.length; i++){
            user_database.push([results[i].email_id, results[i].password, results[i].user_id])
        }
        // console.log("Sending the data from the database(users) to the login.js file")
        // console.log(user_database)
        res.send(user_database)
    })
    user_database = []
})


app.post("/SignUp", function (req, res) {
    let email = req.body.user_id;
    let password = req.body.password;
    connection.query(`Insert into users (password, email_id) values ('${password}', '${email}')`);
    // console.log(`${email} added ✔️`)
})

app.post("/activeUser", function (req, res) {
    let user_id = req.body.id;
    activeUser = user_id;
    // console.log(`user(${user_id}) fetched 👤`)
    // console.log(active_user)
})

// npmScriptRunner.js

app.post("/Redirect", function (req, res) {
  executeNpmStart();
  function executeNpmStart() {
    const options = {
      cwd: 'D:\\github\\Slash\\client', // Specify the folder where npm start should be executed
    };
    const childProcess = exec('npm start', options, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`npm start error: ${stderr}`);
        return;
      }
      console.log(`npm start output: ${stdout}`);
    });
  }
})

// Add these new endpoints after your existing endpoints but before app.listen

// Add item to wishlist
app.post("/api/saveWishlistItem", function(req, res) {
    const item = req.body;
    const query = `INSERT INTO wishlist_items (user_id, timestamp, title, price, website, link, image, rating) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    connection.query(query, 
        [activeUser, item.timestamp, item.title, item.price, item.website, item.link, item.image, item.rating],
        function(err, results) {
            if (err) {
                console.error(err);
                res.status(500).send("Error saving wishlist item");
                return;
            }
            res.status(200).send("Item saved to wishlist");
        }
    );
});

// Get wishlist items for current user
app.get("/api/getWishlistItems", function(req, res) {
    const query = "SELECT * FROM wishlist_items WHERE user_id = ?";
    
    connection.query(query, [activeUser], function(err, results) {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching wishlist items");
            return;
        }
        res.json(results);
    });
});

// Remove item from wishlist
app.delete("/api/removeWishlistItem", function(req, res) {
    const item = req.body;
    const query = "DELETE FROM wishlist_items WHERE user_id = ? AND title = ? AND website = ?";
    
    connection.query(query, [activeUser, item.title, item.website], function(err, results) {
        if (err) {
            console.error(err);
            res.status(500).send("Error removing wishlist item");
            return;
        }
        res.status(200).send("Item removed from wishlist");
    });
});

const port = process.env.port || 2000;
app.listen(port);

// console.log("App is listening on port " + port);

