const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/User");

const generateToken=(user)=>{
  return jwt.sign({
    userId:user.id || user._id,
    role:user.role,
  }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

const register=async (req,res)=>{
  const {name,email,password}=req.body || {};
  if(typeof name!=="string" || !name.trim() ||
     typeof email!=="string" || !email.trim() ||
     typeof password!=="string" || password.length<8){
    return res.status(400).json({message:"Provide a name, valid email, and password of at least 8 characters"});
  }

  const normalizedEmail=email.trim().toLowerCase();
  const existingUser=await User.findOne({email:normalizedEmail});
  if(existingUser){
    return res.status(409).json({message:"An account with that email already exists"});
  }

  const user=await User.create({
    name:name.trim(),
    email:normalizedEmail,
    password:await bcrypt.hash(password,12),
  });
  const token=generateToken(user);
  return res.status(201).json({
    message:"User registered successfully",
    token,
    user:{id:user.id,name:user.name,email:user.email,role:user.role},
  });
};

const login= async (req,res)=>{
  const {email,password}=req.body || {};
  if(typeof email!=="string" || !email.trim() || typeof password!=="string" || !password){
    return res.status(400).json({message:"Please provide an email and password"});
  }

  const user=await User.findOne({email:email.trim().toLowerCase()});
  if(!user || !(await bcrypt.compare(password,user.password))){
    return res.status(401).json({message:"Invalid email or password"});
  }

  return res.status(200).json({
    message:"Login successful",
    token:generateToken(user),
    user:{id:user.id,name:user.name,email:user.email,role:user.role},
  });
};

const getCurrentUser=async(req,res)=>{
  return res.status(200).json({
    user:{id:req.user.id,name:req.user.name,email:req.user.email,role:req.user.role},
  });
};

module.exports={register,login,getCurrentUser};