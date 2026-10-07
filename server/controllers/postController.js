const Post=require("../models/Post");

const getPosts=async(req,res)=>{
  const posts=await Post.find().populate("author","name").sort({createdAt:-1});
  return res.status(200).json(posts);
}

const getPostById=async(req,res)=>{
  const post=await Post.findById(req.params.id).populate("author","name");
  if(!post){
    return res.status(404).json({message:"Post not found"});
  }
  return res.status(200).json(post);
}

const createPost =async(req,res)=>{
  const {title,content}=req.body || {};
  if(typeof title!=="string" || !title.trim() ||
     typeof content!=="string" || !content.trim()){
    return res.status(400).json({message:"A title and content are required"});
  }
  const post=await Post.create({title:title.trim(),content:content.trim(),author:req.user.id});
  const populatedPost=await post.populate("author","name");
  return res.status(201).json(populatedPost);
}

const updatePost=async(req,res)=>{
  const {title,content}=req.body || {};
  if(typeof title!=="string" || !title.trim() ||
     typeof content!=="string" || !content.trim()){
    return res.status(400).json({message:"A title and content are required"});
  }
  const post=await Post.findByIdAndUpdate(
    req.params.id,
    {title:title.trim(),content:content.trim()},
    {new:true,runValidators:true},
  ).populate("author","name");
  if(!post){
    return res.status(404).json({message:"Post not found"});
  }
  return res.status(200).json(post);
}

const deletePost=async(req,res)=>{
  const post=await Post.findByIdAndDelete(req.params.id);
  if(!post){
    return res.status(404).json({message:"Post not found"});
  }
  return res.status(200).json({message:"Post deleted successfully"});
}

module.exports={getPosts,getPostById,createPost,updatePost,deletePost};