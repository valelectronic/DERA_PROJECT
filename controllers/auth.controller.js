import express from 'express';
import User from '../models/user.model.js'; // Import the User model
import jwt from 'jsonwebtoken'; // Import the jsonwebtoken library
import {redis} from "../lib/redis.js"


// Function to generate access and refresh tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET,
         { expiresIn: '7d' });
    return { accessToken, refreshToken };

}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7); // Store the refresh token in Redis with a TTL of 7 days

}

const setCookies = (res, accessToken, refreshToken) => {
    // Set the refresh token in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // helps prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
}


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
    
    const {accessToken, refreshToken} = generateTokens(newUser._id)
    // Generate access and refresh tokens
    await storeRefreshToken(newUser._id, refreshToken)
    // Store the refresh token in cookie
     setCookies(res, accessToken, refreshToken)

    res.status(201).json({user:{
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
    }, message: "User created successfully" })

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