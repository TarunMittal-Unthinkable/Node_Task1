const jwt=require('jsonwebtoken');
const config = require("../auth.config");
const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,config.secret);
        console.log(verifyUser);
        next();
    }catch(error){
        res.status(401).send(error);
    }
}
module.exports=auth;