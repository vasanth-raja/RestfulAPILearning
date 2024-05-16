const mongoose= require('mongoose');
const User=require("../models/user")
const brcypt=require("bcrypt");
const jwt=require('jsonwebtoken')
exports.user_signup=(req,res,next)=>{
    User.find({email:req.body.email}).exec().then(user=>{
        if(user.length){
            return res.status(409).json({
                message:'mail already exists'
            })
        }else{
            brcypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    })
                }
                else{
                    const user=new User({
                        _id:new mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password:hash
                    })
                    user.save().then(result=>{
                        console.log(result)
                        res.status(201).json({
                            message:'User created'
                        })
                    }).catch(err=>{
                        console.log(err)
                        res.status(500).json({
                            error:err
                        })
                    })
                }
            }) 
        }
    })  
}
exports.user_login=(req,res,next)=>{
    User.find({email:req.body.email}).exec().then(user=>{
        if(!user.length){
            return res.status(401).json({
                message:"Auth failed1"
            })
        }
        brcypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:'Auth failed2'
                })
            }
            if(result){
                const token=jwt.sign({
                    emial:user[0].email,
                    userId:user[0]._id
                },process.env.JWT_key,
            {
                expiresIn:"1h"
            }
        )
                return res.status(200).json({
                    message:'Auth successful',
                    token:token
                })
            }
            res.status(401).json({
                message:'Auth failed3'
            })
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
}
exports.user_delete=(req,res,next)=>{
    User.findByIdAndDelete({_id:req.params.userId}).exec().then(result=>{
        console.log(result)
        res.status(200).json({
            message:'User deleted'
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
}
