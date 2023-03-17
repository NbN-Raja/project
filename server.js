const express = require("express");
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose= require("mongoose")



const mysql = require('mysql');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  // Get the value of the mycookie cookie
  res.send('Welcome to UI/UX Sharing Application');
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


// Database Connection

const connection =mongoose.connect(`mongodb://localhost:27017/usersdb`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

require("./app/routes/auth.routes")(app)
require("./app/routes/user.routes")(app)





// Close the connection when the Node.js application is terminated
process.on('SIGINT', () => {
  connection.end(() => {
    console.log('Connection to database closed.');
    process.exit(0);
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

