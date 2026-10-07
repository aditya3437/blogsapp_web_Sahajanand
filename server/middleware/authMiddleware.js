const jwt=require("jsonwebtoken");
const User=require("../models/User");

const protect=async(req,res,next)=>{
  const authHeader=req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({message:"Authorization header missing or invalid"});
  }

  let decoded;
  try{
    const token=authHeader.split(" ")[1];
    decoded=jwt.verify(token,process.env.JWT_SECRET);
  }
  catch{
    return res.status(401).json({message:"Not authorized"});
  }

  const user=await User.findById(decoded.userId).select("_id name email role");
  if(!user){
    return res.status(401).json({message:"Not authorized"});
  }

  req.user=user;
  return next();
}

const adminOnly =(req,res,next)=>{
  if(!req.user || req.user.role!=="admin"){
    return res.status(403).json({message:"Access denied"});
  }
  return next();
}

module.exports={protect,adminOnly};