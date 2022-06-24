require("dotenv").config();
const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
const router=require('./routes/routes')

const mongoose =require('mongoose')
app.use(cors())
app.use(express.json())
app.use('/',router)


let dbName='RegisterUser'
let URL=`mongodb+srv://sreekanth:mJAbpJRJk3WqzCAX@cluster0.4pr0n.mongodb.net/${dbName}`

mongoose.connect(URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})


const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error"))

db.once("open",function(){
    console.log('connected successfully')
})
app.listen(process.env.PORT || 5000,'0.0.0.0',()=>{
    console.log('listen to port')
})
