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
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect Password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const signup=async(req,res)=>{

      const { email, username, password} = req.body;
      const hashedPassword = await bcrypt.hash(password,10);
      const newUser = {
        email,
        username,
        password:hashedPassword
      }

      const db = await connectDatabase();
      const usersCollection = db.collection('users');
      const user = await usersCollection.insertOne(newUser);
      const token = jwt.sign({ userId: user.insertedId }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token, user });

}

