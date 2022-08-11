const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken")
const User=require("../models/user.js")

const signup=async(req,res,next)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email:email})
    if(user){
        return res.status(400).json({
            error:"User already exists"
        })
    }
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    const newUser=new User({
        email:email,
        password:hashedPassword
    })
    const savedUser=await newUser.save()
    res.json(savedUser)
}
const login=async(req,res,next)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email:email})
    if(!user){
        return res.status(400).json({
            error:"User with this email does not exist"
        })
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({
            error:"Invalid credentials"
        })
    }
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
    res.header("auth-token",token).json({token})
}

module.exports={
    login,
    signup
}