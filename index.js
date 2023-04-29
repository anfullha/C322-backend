const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const corsOptions ={
    origin:'*', 
    credentials:true,  
    optionSuccessStatus:200
 }
 
 const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    PORT,
  } = process.env;

app.use(cors(corsOptions));
const mysql = require("mysql");

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});




module.exports = db;
db.connect((err) =>{
    if(err){
        console.log("error connecting " + err.stack);
    }
    else{
        console.log("connected as " + db.threadId);
    }
})

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

app.get("/api/get/trips/UserID/:userID", (req, res) =>{
    const userID = req.params.userID;
    console.log("userid "+ userID);
    db.query('SELECT * FROM trips WHERE trips.UserID = ?;', [userID], (err, result)=>{
        if(err){
            console.log(err);
        }
        console.log(result);
        res.send(result);
    })
})

app.get("/api/get/username/:userID", (req, res) => {
    const userID = req.params.userID;
    db.query('SELECT user.Username FROM user WHERE user.UserID = ?;', [userID], (err, result) => {
        if(err){
            console.log(err);
        }
        console.log(result);
        res.send(result);
    })
})

app.post("/api/get/userID", (req, res) => {
    const username = req.body.username;
    db.query("SELECT user.UserID from user WHERE user.Username = ?;", username, (err, result) => {
        if(err){
            console.log(err);
        }
        res.send(result);
        console.log(result);
    })
})
app.post("/api/login/user", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("here");
    console.log(username + " " + password);
    db.query("SELECT user.UserID FROM user WHERE user.Username = ? AND user.Password = ?;", [username, password], (err, result) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
        console.log(result);
    })
})
app.post("/api/insert/user", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username + " " + password);
    db.query("INSERT INTO user (Username, Password) VALUES (?, ?)", [username, password], (err, result) =>{
        if(err){
            console.log(err);
        }
        console.log(result);
        res.send("inserted");
    })


})


app.post("/api/insert/trip", (req, res) => {
    const userID = req.body.userID;
    const distance = req.body.distance;
   
    db.query("INSERT INTO trips (UserID, Distance) VALUES (?, ?);", [userID, distance], (err, result) =>{
        if(err){
            console.log(err);
        }
        console.log(result);
    })


})

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});