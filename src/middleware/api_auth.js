const api_key="apikeytarununthinkablesecretkeyhurraya";
const api_auth=async(req,res,next)=>{
    try{
        const {key}=req.param;
        if(api_key===key){
        console.log(verifyUser);}
        else{
            res.status(400).send("Inavlid request");
        }
        next();
    }catch(error){
        res.status(401).send(error);
    }
}
module.exports=api_auth;