const userModel=require('../models/user.model');

const signup=async(name,email,password)=>{
    if(!name || !email || !password) throw new Error("All fields are required");
    const user=await userModel.findOne({email});
    if(user) throw new Error("User already exists");
    return userModel.create({name,email,password});
}

const updateScore=async(id)=>{
    const user=await userModel.findById(id);
    if(!user) throw new Error("User not found");
    user.score++;
    return user.save();
}

const getUserById=async(id)=>{
    const user=await userModel.findById(id);
    if(!user) throw new Error("User not found");
    return user;
}

const getUserScore=async(id)=>{
    const user=await userModel.findById(id);
    if(!user) throw new Error("User not found");
    return {score:user.score};
}

module.exports={signup, updateScore, getUserById};