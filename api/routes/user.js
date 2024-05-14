const express = require('express')
const router=express.Router();
const mongoose= require('mongoose');
const User=require("../models/user")
const brcypt=require("bcrypt")

router.post('/signup',(req,res,next)=>{
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
})
router.delete('/:userId',(req,res,next)=>{
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
})


module.exports=router