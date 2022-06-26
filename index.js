require("dotenv").config();
const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
const router=require('./routes/routes')

const mongoose =require('mongoose')
app.use(cors())
app.use(bodyParser.json())


app.use('/',router)


let dbName='RegisterUser'
let URL=`mongodb+srv://sreekanth:mJAbpJRJk3WqzCAX@cluster0.4pr0n.mongodb.net/${dbName}`

const port=process.env.PORT || 3000

mongoose.connect(URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})


const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error"))

db.once("open",function(){
    console.log('connected successfully')
})


app.listen(port, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
