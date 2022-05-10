const Pool=require("pg").Pool;

const pool=new Pool({
    user:"postgres",
    password:"hrhk",
    database:"employee",
    host:"localhost",
    port:5432
});

module.exports=pool;