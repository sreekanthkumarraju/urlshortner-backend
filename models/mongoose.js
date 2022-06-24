const mongoose=require('mongoose')

let schema=mongoose.Schema

let userSchema=new schema({
   firstName:{type:String},
   lastName:{type:String},
   email:{type:String},
   password:{type:String}
})

let userModel=mongoose.model('user',userSchema)

module.exports=userModel
