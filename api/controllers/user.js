const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length) {
        return res.status(409).json({
          message: "mail already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};
exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user.length) {
        return res.status(401).json({
          message: "Auth failed1",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed2",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              emial: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          ,(err)=>{console.log(err)});
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed3",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
exports.user_delete = (req, res, next) => {
  User.findByIdAndDelete({ _id: req.params.userId })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.user_forgot_password = (req, res, next) => {
    const email=req.body.email
  User.find({email})
    .exec()
    .then((users) => {
        const user=users[0];
      console.log(user);
      if (!user) {
        return res.status(404).json({
          message: "User doesnt Exist",
        });
      } else {
        const id=user.id
        const token = jwt.sign({ id: user.id }, "jwt_secret_key", {
          expiresIn: "1d",
        });
        var transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          service: "gmail",
          auth: {
            user: "autoworksproj@gmail.com",
            pass: "xgaslkcgvejbsces",
          },
        });

        var mailOptions = {
          from: 'User Management "<autoworksproj@gmail.com>"',
          to: email,
          subject: "Forgot Password",
          text: `http://localhost:5173/resetPassword/${token}/${id}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(".....................................", error);
            return res.status(500).json({

              message: "Mail not sent",
            });
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({
              message: "Mail Sent",
            });
          }
        });
      }
    }).catch(err=>{
      console.log(err)
      return res.status(500).json({
        message: "Some Error",
      });
    });
};
exports.user_reset_password = (req, res, next) => {
 
  const token= req.body.token ;
  jwt.verify(token,"jwt_secret_key",(err,decoded)=>{
    if(err){
      console.log(err)
    }
    else{
      console.log(decoded)
      bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
          console.log(err);
          res.status(500);
        }
        else{
          console.log(hash)
          console.log(decoded.id)
          User.updateOne({_id:decoded.id},{$set:{password:hash}}).exec().
          then(result=>{
            console.log(result)
            res.status(200).json({
              message:"Password updated"
            })
          })
          .catch(err=>{
            console.log(err)
            res.status(500).json({
              message:"Password update Failed"
            })
          })
        }
      })

    }
  })
  console.log(token)
  res.status(200)
};
