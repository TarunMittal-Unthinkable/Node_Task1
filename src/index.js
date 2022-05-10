const express = require("express");
const app = express();
const pool = require("../db");

const bcrypt=require('bcryptjs');
const jwt = require("jsonwebtoken");
const config = require("../src/auth.config");
const cookieParser=require('cookie-parser');
const auth=require("./middleware/auth");
const apiauth=require("./middleware/api_auth");
const rateLimit=require("./middleware/ratelimit");

const port=process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
 //req.body

//Routes

//get all emp
app.get("/employee/:key",apiauth,auth, async (req, res) => {
  try {
    const e=`select getemp2()`;
    const allemp = await pool.query(e);
    res.json(allemp.rows);
    //console.log(req.cookies.jwt);
    
  } catch (err) {
    console.log(err.message);
  }
});

//get specific emp
app.get("/employee/:id", auth,async (req, res) => {
  const { id } = req.params;
  const get=`select getemp3($1)`
  try {
    const emp = await pool.query(get, [id]);
    res.json(emp.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//search all emp
app.get("/employee/search/:name", auth,async (req, res) => {
  const { name } = req.params;
  const search=`select searchemp($1)`
  try {
    const emp1 = await pool.query(search, [name]);
    res.json(emp1.rows);
  } catch (err) {
    console.log(err.message);
  }
});


//create all

app.post("/employee", auth,async (req, res) => {
  try {
    const { emp_id } = req.body;
    const { name } = req.body;
    const { address } = req.body;
    const { mob_no } = req.body;
    const postemp1=`CALL postemp($1,$2,$3,$4)`;
    
    const newemp = await pool.query(postemp1, [emp_id, name, address,mob_no]);
   
    res.json(newemp.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//update all emp
app.put("/employee/:id", auth,async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { address } = req.body;
    const { mob_no } = req.body;
    const update=`call upemp($1,$2,$3,$4)`;
    const updateemp = await pool.query(
      update,
      [id,name,address,mob_no]
    );
    res.json("emp was updated");
  } catch (err) {
    console.log(err.message);
  }
});

//delete all
app.delete("/employee/:id", auth,async (req, res) => {
  try {
    const { id } = req.params;
    const del=`call delemp($1)`
    const deleteemp = await pool.query(del, [
      id,
    ]);
    res.json("emp was deleted");
  } catch (err) {
    console.log(err.message);
  }
});


//registeruser
app.post("/signup", async (req, res) => {
  try {
    const { username } = req.body;
    const { email } = req.body;
    const { password } =req.body;
    const { confirmPass } = req.body;
    const hash= await bcrypt.hash(password,10);
    
   
    if(password===confirmPass){
    const token = await jwt.sign({ _id: hash }, config.secret, {
        expiresIn: 86400 // 24 hours
      }); 
      res.cookie("jwt",token,{
        expires:new Date(Date.now()+80000),
        httpOnly:true
      });
      
    const register=`CALL registeruser1($1,$2,$3,$4,$5)`;
    
    const newemp = await pool.query(register, [username, email, hash,hash,token]);
   
    res.json(newemp.rows[0]);}
    else{
      res.send("password not match");
    }
  } catch (err) {
    console.log(err.message);
  }
});


//loginuser
app.post("/login", rateLimit,async (req, res) => {
  try {
    
    const { email } = req.body;
    const { password } = req.body;
    const hash1= await bcrypt.hash(password,10);
    const getuser=`select getuser($1)`;
    const newemp1 = await pool.query(getuser, [email]);
    const isMatch=await bcrypt.compare(password,newemp1.rows[0].getuser);
    const token = await jwt.sign({ _id: hash1}, config.secret, {
      expiresIn: 86400 // 24 hours
    }); 
    res.cookie("jwt",token,{
      expires:new Date(Date.now()+70000),
      httpOnly:true,
    });

    if(isMatch){
      res.status(201).send("Succesfully Login");
    }else{
      res.send("invalil details")
    }
  

  } catch (err) {
    res.status(400).send("invalil details")
  }
});


//logout employee
app.post("/logout",auth,async(req,res)=>{
  try{
    res.clearCookie("jwt");
    res.send("Logout successfull");
     
    //res.render("login");

  }catch(error){
    res.status(400).send(error);
  }
})

//Server listening
app.listen(port, () => {
  console.log(`Server is listening ${port}`);
});
