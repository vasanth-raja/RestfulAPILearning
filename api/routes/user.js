const express = require('express')
const router=express.Router();
const checkAuth=require('../middleware/check-auth')
const UserController=require('../controllers/user')
router.post('/signup',UserController.user_signup)
router.post('/login',UserController.user_login)
router.delete('/:userId',checkAuth,UserController.user_delete)
router.post('/forgotPassword',UserController.user_forgot_password)
router.post('/resetPassword',UserController.user_reset_password)

module.exports=router