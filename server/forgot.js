const { sendEmail } = require("./emailer");
const express = require("express");

const app = express();

const randomString=length=>{
    let text="";
    const possible="abcdefghijklmnopqrstuvwxyz0123456789_-.";
    for(let i=0;i<length;i++){
        text+=possible.charAt(Math.floor(Math.random()*possible.length));

    }
    return text;
}

app.post('/api/forgotpass',(req,res)=>{
    if(!req.body)return res.status(400).json({message:'No Request Body'});
    if(!req.body.email)return res.status(400).json({message:'No Email in Request Body'});

    const token= randomString(40);
    const emailData={
        to:req.body.email,
        subject:"Password Reset Instructions",
        text:'Please use the following link for instructions to reset your password: http:localhost:3000/Signup',
        html:'<p>Please use the link below for instructions to reset your password,</p><p>$(App_URL_BASE}/resetpass/${token}</p>',
    };

    return User
    .update({email:req.body.email},{$set:{resetPasslink: token}},function(error,feedback){
    if(error) return res.send(error);
    else{
        sendEmail(emailData);
        return res.status(200).json({message:'Email has been sent to $(req.body.email}'});``
    }
    })
})

    app.put('/api/resetpass',(req,res)=>{
        // const{resetPassLink,newPassword}=req.body;
        // User.hashPassword(newPassword)
        // .then(hashedPass=>{
        //     return User
        //     .update({resetPassLink},{$set:{password:hashedPassLink:''}},function(error,feedback){
        //     if(error) return res.send(error);
        //     return res.send(feedback);
        //     })
        // })
    })