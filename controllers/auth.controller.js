import express from 'express';
import User from '../models/user.model.js'; // Import the User model



// for signing up a user
export const signUp = async(req, res) => {
const { name, email, password } = req.body;
try {
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    //authenticate user
    
    

    res.status(201).json({ message: "User created successfully" })

} catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: error.message });
    
}







    
}


export const logIn = async(req, res) => {
    res.send("login Up Route")
    
}


export const logOut = async(req, res) => {
    res.send("logout Up Route")
    
}