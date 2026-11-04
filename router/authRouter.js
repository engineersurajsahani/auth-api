const express = require('express');
const User = require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const authMiddleware=require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register',async (request,response)=>{
    try {
        const {name,username,email,password}=request.body;
        if(!name){
            return response.status(400).json({message:'Name is required'});
        }
        if(!username){
            return response.status(400).json({message:'Username is required'});
        }
        if(!email){
            return response.status(400).json({message:'Email is required'});
        }
        if(!password){
            return response.status(400).json({message:'Password is required'});
        }

        const existingUsername=await User.findOne({username:username});
        if(existingUsername){
            return response.status(400).json({message:'Username already exists'});
        }

        const existingEmail=await User.findOne({email:email});
        if(existingEmail){
            return response.status(400).json({message:'Email already exists'});
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser={
            name:name,
            username:username,
            email:email,
            password:hashedPassword
        };

        const user=new User(newUser);
        await user.save();
        return response.status(201).json({message:'User registered successfully',user:user});
    } catch (error) {
        response.status(500).json({message:error.message});
    }
});

router.post('/login',async (request,response)=>{
    try {
        const {username,password}=request.body;

        if(!username){
            return response.status(400).json({message:'Username is required'});
        }
        if(!password){
            return response.status(400).json({message:'Password is required'});
        }

        const user=await User.findOne({username:username});
        if(!user){
            return response.status(400).json({message:'Invalid Username'});
        }

        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return response.status(400).json({message:'Invalid Password'});
        }

        const token=jwt.sign(
            {
                userId:user._id,
                name:user.name,
                username:user.username,
                email:user.email
            },
            'mernstack',
            {
                expiresIn:'1h'
            }
        );

        return response.status(200).json({message:'Login successful',token:token});
    } catch (error) {
        return response.status(500).json({message:error.message});
    }
});

router.get('/profile',authMiddleware,(request,response)=>{
    try {
        response.status(200).json({message:'Profile fetched successfully',user:request.user});
    } catch (error) {
        response.status(500).json({message:error.message});
    }
});

module.exports=router;