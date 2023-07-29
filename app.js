const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const con = require('./config/database');
const User = require('./model/user');
const auth = ('./middleware/auth.js');

const app = express();
app.use(express.json());

dotenv.config();
con.connect();

app.post("/register", async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      return res.status(400).send("All Inputs Required!");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists, Baby!");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/welcome",auth,(req,res)=>{
    res.status(200).send("Welcome Guys!");
});

app.post("/login", async (req, res) => {
  try{
    const {email,password} = req.body;

    if(!(email && password))
    {
        res.status(400).send("All Input Is Required!");
    }

    const user = await User.findOne({email});

    if(user &&(await bcrypt.compare(password, user.password)))
    {
        const token = jwt.sign(
            {
                user_id: user._id,email
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token;

        res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  }
  catch(err){
    console.log(err);
  }
});

module.exports = app;
