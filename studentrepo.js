const { response } = require('express');

const express=require('express');

var mysql=require('mysql');

const uuidv4=require('uuid').v4;

const port =3030;

var con =mysql.createConnection({
    host:"localhost",

    user:"root",

    password:"",

    database:"Student_Database_System"
})

let app=express();

app.use(express.json());

con.connect(function(err){
    if(err) throw err;
    console.log("Connnected");
    /*con.query("CREATE DATABASE Student_Database_System",function(err, result)
    {
        if (err) throw err;
        console.log("Database Created.");
    })
    */

    //Name DOB Age Address PhoneNo Email Password

                       // ADMIN TABLE
/*
    con.query("CREATE TABLE Admin (Name varchar(255),DOB date,Address varchar(255),PhoneNo varchar(255),Email varchar(255) unique,Password varchar(255))",
    function(error,result){
        if (error) throw error;
        console.log("Admin Table Created");
        console.log(result);
    });
*/
                      //STUDENT TABLE 
    // Attributes--> name, roll_no,father_name,mother_name,address
    /*con.query("CREATE TABLE Student (id varchar(255),name varchar(255),roll_no varchar(255),father_name varchar(255),mother_name varchar(255),address varchar(255))",(error,result)=>{
        if(error) throw error;
        console.log("Student Table created.")
        console.log(result);
    })*/
   
})
                   // ADMIN
app.get('/admin',(req,res)=>{

    let data=req.body;
    con.query(`select * from Admin where Name="${data.Name}" AND Password="${data.Password}"`,(err,result)=>
    {
        if(err) throw err;
        res.send(result);
    })
})

app.post('/admin',(req,res)=>{
    let data=req.body;
 
    console.log(req.body);
        con.query(`insert into Admin (Name,DOB,Address,PhoneNo,Email,Password) values("${data.Name}",${data.DOB},"${data.Address}"
    ,${data.PhoneNo},"${data.Email}","${data.Password}")`,
    (error,result)=>{
        
        if(error)
            res.send("Try Another Email, already in use.");
        else
        res.send("Data Added.")


    })
    
})

app.patch('/admin',async (req,res)=>{
    let data=req.body;
    con.query(`select * from Admin where Name="${data.Name}" AND Password="${data.Password}"`,(err,result)=>{
        if(err) throw err;
        if(result.length===0)
        {
            res.send("INVALID USERNAME OR PASSWORD.")
        }
        if(result.length>0)
        {
            con.query(`UPDATE Admin 
                       SET  DOB="${data.DOB?data.DOB:result[0].DOB}",
                        Address="${data.Address?data.Address:result[0].Address}",
                        PhoneNo ="${data.PhoneNo?data.PhoneNo:result[0].PhoneNo}"
                        WHERE Name="${data.Name}" AND Password="${data.Password}"`
                       ,(error,result)=>{
                            if(error) throw error;
                            res.send(result);
                        })
        }
    })
})

app.delete('/admin',(req,res)=>
{
    let data=req.body;
    con.query(`delete from Admin WHERE Name="${data.Name}" AND Password="${data.Password}"`,(err,result)=>
    {
        if(err) throw err;
        res.send(result);
    })
})

                       //  STUDENT     

                       
app.get('/student',(req,res)=>{
    let data=req.body;
    //console.log(req.body);
   con.query(`select * from Admin where Email="${data.Email}" AND Password="${data.Password}"`,(err,result)=>{
        if(err)throw err;
        if(result.length===0)
        {
            res.send("Invalid Email or Password !")
        }
        if(result.length>0)
        {
             con.query(`select * from student where id ="${data.id}"`,(err,result)=>{
                if(err) throw err;
                res.send(result);
             })
        }
    })

})
app.post('/student',(req,res)=>{
    let data=req.body;
    con.query(`select * from Admin where Email="${data.Email}" AND Password="${data.Password}"`,(err,result)=>{

        if(err)throw err;
        if(result.length===0)
        {
            res.send("Invalid Email or Password !")
        }
        if(result.length>0)
        {
             con.query(`insert into Student (id,name,roll_no,father_name,mother_name,address) values("${uuidv4()}","${data.name}","${data.roll_no}","${data.father_name}","${data.mother_name}","${data.address}")`,(err,result)=>{
                if(err) throw err;
                res.send(result);
             })
        }
    })
   
})
app.patch('/student',async(req,res)=>{
     let data=req.body;
    con.query(`(select * from Admin where Email="${data.Email}" AND Password="${data.Password} ")`
    ,(err,result)=>{
        
        if(err) throw err;
        if(result.length===0)
        {
            res.send("INVALID Email OR PASSWORD.")
        }
        if(result.length>0)
        {
            con.query(`select * from Student where id="${data.id}"`,(err,result)=>{
                if(err)throw err;
                else{
                  con.query(`UPDATE Student SET name="${data.name?data.name:result[0].name}",
                        roll_no=${data.roll_no?data.roll_no:result[0].roll_no},
                        father_name="${data.father_name?data.father_name:result[0].father_name}",
                        mother_name ="${data.mother_name?data.mother_name:result[0].mother_name}",
                        address ="${data.address?data.address:result[0].address}" where id="${data.id}"`,(error,result)=>{
                            if(error) throw error;
                            res.send(result);
                        })}
            })

        }
    })
})

app.delete('/student',(req,res)=>{
     let data=req.body;
   con.query(`select * from Admin where Email="${data.Email}" AND Password="${data.Password}"`,(err,result)=>{
        if(err)throw err;
        if(result.length===0)
        {
            res.send("Invalid Email or Password !")
        }
        if(result.length>0)
        {
             con.query(`delete  from Student where id="${data.id}"`,(err,result)=>{
                if(err) throw err;
                res.send(result);
             })
        }
    })
})


app.listen(port,()=>
{
    console.log("Server started.")
})
/*
{
    "Name":"Naman",
    "DOB":"2000-01-02",
    "Address":"Agra(UP)",
    "PhoneNo":"8293823098",
    "Password":"2321ji"
}
 Email="${data.Email?data.Email:result[0].Email}",
Password="${data.Password?data.Password:result[0].Password}"

"Email":"Satya9bb0@gmail.com",
        "Password":"2321ji"  

{
   "name":"maya",
    "roll_no":"828329",
    "father_name":"mohan",
    "mother_name":"yati",
    "address":"Beswan",
    "Email":"Satya8bb0@gmail.com",
    "Password":"2321ji"


}
*/
