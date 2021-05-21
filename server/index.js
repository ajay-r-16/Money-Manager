
const express = require('express');
const dotenv = require('dotenv');
const mongodb = require('mongodb');
const bcrypt = require("bcrypt");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
dotenv.config();
const objectId = mongodb.ObjectID;

app.use(express.json());
app.use(cors());

const mongoClient = mongodb.MongoClient;


app.post('/register',async (req,res)=>{
    let client;
    try{
        client = await mongoClient.connect(process.env.DATABASE_ACCESS);
        let db = client.db('Money-Manager');
        
        let user = await db.collection('Users').findOne({email:req.body.email});
      

        if(user)
            return res.status(200).json({ message:"Email already exists" })

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password,salt);
        req.body.password = hash;
        req.body.transactions = [];

        await db.collection('Users').insertOne(req.body);

        res.status(200).json({ message:"User successfully created" });

    }
    catch(err){
        console.error(err);
        res.status(400).json({ message:"Try again after some time" })
    }
    client.close();
});


app.post('/login',async (req,res)=>{
    let client;
    try{
        client = await mongoClient.connect(process.env.DATABASE_ACCESS);
        let db = client.db("Money-Manager");
        let data = await db.collection("Users").findOne({email : req.body.email});
        
        if(data){
            let isValid = await bcrypt.compare(req.body.password, data.password);
            
            if(isValid){
                let token = await jwt.sign({ user_id : data._id},process.env.TOKEN_SECRET)
                
                res.status(200).json( {message : "Login Successful", token: token, user: data.name});
            }

            else{
                res.status(200).json({message : "Login Unsuccessful. Invalid Email/Password"});
            }
        }
        else{
            res.status(200).json({message :"User is not registered"});
        }
    }

    catch(err){
        console.error(err);
        res.status(400).json({ message:"Try again after some time" });
    }
    client.close();
});

app.put('/addTransaction',authentication,async (req,res)=>{
    let client;
    try{
        client = await mongoClient.connect(process.env.DATABASE_ACCESS);
        let db = client.db('Money-Manager');
        let id = objectId(res.locals.user_id);
        req.body.date = new Date( req.body.date );
        await db.collection('Users').findOneAndUpdate({_id: id},{ $push: { transactions : req.body}});
        res.status(200).json({message: "Transaction added successfully"});

    }
    catch(err){
        console.error(err);
        res.status(400).json({message: "Try again after some time"})
    }
    client.close();
})

app.get('/getTransaction/:year/:month/:type',authentication,async (req,res)=>{
    let client;
    try{
        
        client = await mongoClient.connect(process.env.DATABASE_ACCESS);
        let db = client.db('Money-Manager');
        let id = objectId(res.locals.user_id);
        
        // let data = await db.collection('Users').findOne({_id : id});
        // "transactions": { "$elemMatch": { "date": { $gt: new Date('2021'), $lte: new Date('2022') } } }

        let data = await db.collection('Users').findOne({_id: id } ,{ projection :{name: 0, _id:0, email:0, password:0} } );
        let sliced =[];
        let year = Number(req.params.year);
        let month = Number(req.params.month);
        
        if(req.params.type==="month"){
            
            sliced = data.transactions.filter((item)=>{
                return (item.date > new Date(year,month) && item.date <= new Date(year,month+1));
            })
        }
        else{
           
            sliced = data.transactions.filter((item)=>{
                return (item.date >= new Date(String(year)) && item.date < new Date(String(year+1)));
            })
        }
        sliced.sort((a,b)=>{
            return a.date - b.date ;
        })
        res.status(200).send(sliced);

    }
    catch(err){
        console.error(err);
        res.status(400).json({message: "Try again after some time"})
    }
    client.close();
})



async function authentication(req,res,next){
    
    try{
      if(req.headers.authorization!==undefined){
        let decode = await jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET);
        
  
        if(decode !== undefined){
            res.locals.user_id = decode.user_id
            next();
        }
        else{
          res.status(401).json({message : "invalid token"})
        }
      }
      else{
        res.status(401).json({message : "No token in header"})
      }
      
    }catch(error){
      console.log(error);
    }
  }


app.listen( process.env.PORT || 5000,()=>{console.log("Server is up and running")}); 




