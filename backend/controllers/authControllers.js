import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import connectDatabase from "../config/database.js";

dotenv.config();

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = await connectDatabase();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'This email is not registered, Please check again' });
        }
        
        const userName = user.username;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Please enter correct password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: 365 * 24 * 60 * 60 });

        res.json({ token, userName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const signup = async (req, res) => {

    try {
        const { email, username, password} = req.body;
        const db = await connectDatabase();
        const usersCollection = db.collection('users');
        const  checkUser = await usersCollection.findOne({ email });
        console.log(checkUser)
          if (checkUser !== null) {
              return res.status(400).json({ message: 'User already exists with this email' });
          }
        const  checkUserName = await usersCollection.findOne({ username });
        console.log(checkUserName)
          if (checkUserName !== null) {
              return res.status(400).json({ message: 'User already exists with this username, Chose other' });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = {
          email,
          username,
          password:hashedPassword
        }
        
        const user = await usersCollection.insertOne(newUser);
        const token = jwt.sign({ userId: user.insertedId }, process.env.JWT_SECRET, { expiresIn: 365 * 24 * 60 * 60 });
        res.status(201).json({ token, username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
   
  };
  

