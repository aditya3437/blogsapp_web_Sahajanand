const bcrypt=require("bcryptjs");
const User=require("../models/User");

const publicUser=(user)=>({
  id:user.id,
  name:user.name,
  email:user.email,
  role:user.role,
  createdAt:user.createdAt,
});

const getUsers=async(req,res)=>{
  const users=await User.find().select("-password").sort({createdAt:-1});
  return res.status(200).json(users);
};

const getUserById=async(req,res)=>{
  const user=await User.findById(req.params.id).select("-password");
  if(!user){
    return res.status(404).json({message:"User not found"});
  }
  return res.status(200).json(user);
};

const createUser=async(req,res)=>{
  const {name,email,password,role="user"}=req.body || {};
  if(typeof name!=="string" || !name.trim() ||
     typeof email!=="string" || !email.trim() ||
     typeof password!=="string" || password.length<8){
    return res.status(400).json({message:"Provide a name, valid email, and password of at least 8 characters"});
  }
  if(!["user","admin"].includes(role)){
    return res.status(400).json({message:"Role must be user or admin"});
  }

  const normalizedEmail=email.trim().toLowerCase();
  if(await User.exists({email:normalizedEmail})){
    return res.status(409).json({message:"An account with that email already exists"});
  }

  const user=await User.create({
    name:name.trim(),
    email:normalizedEmail,
    password:await bcrypt.hash(password,12),
    role,
  });
  return res.status(201).json({
    message:"User created successfully",
    user:publicUser(user),
  });
};

const updateUser=async(req,res)=>{
  const {name,email,role,password}=req.body || {};
  if(name===undefined && email===undefined && role===undefined && password===undefined){
    return res.status(400).json({message:"Provide at least one user field to update"});
  }
  const user=await User.findById(req.params.id);
  if(!user){
    return res.status(404).json({message:"User not found"});
  }
  if(req.user.id===user.id && role && role!=="admin"){
    return res.status(400).json({message:"You cannot remove your own admin access"});
  }

  if(name!==undefined){
    if(typeof name!=="string" || !name.trim()){
      return res.status(400).json({message:"Name cannot be empty"});
    }
    user.name=name.trim();
  }
  if(email!==undefined){
    if(typeof email!=="string" || !email.trim()){
      return res.status(400).json({message:"Email cannot be empty"});
    }
    user.email=email.trim().toLowerCase();
  }
  if(role!==undefined){
    if(!["user","admin"].includes(role)){
      return res.status(400).json({message:"Role must be user or admin"});
    }
    user.role=role;
  }
  if(password!==undefined && password!==""){
    if(typeof password!=="string" || password.length<8){
      return res.status(400).json({message:"Password must be at least 8 characters"});
    }
    user.password=await bcrypt.hash(password,12);
  }

  await user.save();
  return res.status(200).json({
    message:"User updated successfully",
    user:publicUser(user),
  });
};

const deleteUser=async(req,res)=>{
  if(req.user.id===req.params.id){
    return res.status(400).json({message:"You cannot delete your own account while signed in"});
  }
  const user=await User.findByIdAndDelete(req.params.id);
  if(!user){
    return res.status(404).json({message:"User not found"});
  }
  return res.status(200).json({message:"User deleted successfully"});
};

module.exports={getUsers,getUserById,createUser,updateUser,deleteUser};
