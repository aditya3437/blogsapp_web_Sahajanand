const express=require("express");

const {getUsers,getUserById,createUser,updateUser,deleteUser} =require("../controllers/userController");
const {protect,adminOnly} = require("../middleware/authMiddleware");

const router=express.Router();

router.get("/",protect,adminOnly,getUsers);
router.get("/:id",protect,adminOnly,getUserById);
router.post("/",protect,adminOnly,createUser);
router.put("/:id",protect,adminOnly,updateUser);
router.delete("/:id",protect,adminOnly,deleteUser);

module.exports=router;
