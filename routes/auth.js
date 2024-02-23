const express = require('express');
const router = express.Router();
const { ServerError } = require('../errors');
const bcrypt = require('bcrypt');
const prisma = require('../prisma');
const jwt = require('jsonwebtoken');

//Routes

//route to register 
router.post('/register', async (req, res, next) => {
    try{
        const { username, password } = req.body;

        //Check if username and password were provided
        if (!username || !password) {
            throw new ServerError(400, "Username and password required.");
        }

        //Check if account already exists
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (user) {
            throw new ServerError(400, 'Account with that username already exists');
        }

        //Create new user
        //Hashing takes place in prisma/index.js
        const newUser = await prisma.user.create({
            data: { username, password },
        });
        // const token = jwt.sign({ id: newUser.id });
        // res.json({ token });
    }catch (err) {
        next(err);
        }
     });

// route to sign in - Returns token for account if credentials valid
router.post('/login', async (req, res, next) => {
    try {
      const { username, password } = req.body;
  
      // Check if username and password provided
      if (!username || !password) {
        throw new ServerError(400, "Username and password required.");
      }
  
      // Check if account exists
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user) {
        throw new ServerError(400, `Account with username ${username} does not exist.`);
      }
  
      // Check if password is correct
      const passwordValid = await bcrypt.compare(password, user.password);
      const accessToken = jwt.sign(JSON.stringify(user), process.env.JWT)
        if(passwordValid){
            res.json({ accessToken: accessToken });
        } else {
            throw new ServerError(401, "Invalid password.");
        }

    //   const token = jwt.sign({ id: user.id });
    //   res.json({ token });
    } catch (err) {
      next(err);
    }
  });

module.exports = router; 