//-------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const register = require("./routes/register");
const login = require("./routes/login");
const student = require("./routes/student");
const teacher = require("./routes/teacher");
const parent = require("./routes/parent");
const server = express();

//-------------------
server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected...!");
  })
  .catch(err => console.log(err));

//-------------------
server.use("/register", register);
server.use("/login", login);
server.use("/student", student);
server.use("/teacher", teacher);
server.use("/parent", parent);

//-------------------
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening on port ${process.env.PORT || 5000} !`);
});
