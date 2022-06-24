require('dotenv').config()
const userModel=require('../models/mongoose')
const {hashPassword}=require('../authentication/auth')
let bcrypt=require('bcrypt')
const sendMail = require('../utils/sendmail')
const jwt=require('jsonwebtoken')

const StoreUserInfo=async (req,res)=>{
         console.log(req.body)
        
        let encryptedpasssword=await hashPassword(req.body.password)
         req.body.password=encryptedpasssword
   
         try{
              let user={
                  firstName:req.body.firstName,
                  lastName:req.body.lastName,
                  email:req.body.email,
                  password:req.body.password
                   }


                    const activation_token = createActivationToken(user)
                    console.log(activation_token)
                    const link=`${process.env.BASE_URL}/activate-user/${activation_token}`

                   await sendMail(
                         user.email,
                         "activation link",
                          {
                            name:user.firstName,
                            link:link
                          },
                            './template/useractivation.handlebars' 
                        )

                        res.json({msg: "Register Success! Please activate your email to start."})

                 }
               catch(error)
               {
                   console.log(error)
              }
 
        }

const  verifyLogin=async (req,res)=>{
    let user=await userModel.findOne({email:req.body.email})
    
    if(!user)
    {
        res.json({
            statusCode:400,
            message:"user with email Id does not exists"
        })
    }
    
   else
     {
        let matched=await bcrypt.compare(req.body.password,user.password)

        if(matched)
         {
             res.json({
                 statusCode:200,
                 message:"User logged in successfully"
             })
         }
         else{
            res.json({
                statusCode:400,
                message:"Password incorrect"
            })
         }
     }
}


const activateEmail=async (req,res)=>{


       const { token }=req.body
     
     try{
         if(token)
         {
            jwt.verify(token, 'secret',async (err, decoded)=>{
                if (err) {
                    console.log(' link expired');
                    res.json({
                        statusCode:400,
                        errors:"Invalid link or link expired"
                     })
                   }
                    else{
                    
            const { firstName,lastName,email,password}=jwt.decode(token)

            console.log(firstName,lastName,email,password)
      
           let checkuser=await userModel.findOne({email:email})
            console.log(checkuser)
          if(checkuser)
          {
            res.json({
                statusCode:400,
                errors:"User already exists"
             })
          }
          else{
                
           let userData=new userModel({
               firstName,
               lastName,
               email,
               password
           })

            userData.save();

           res.json({
               statusCode:200,
               message:"Hurray !!! Your Account has been activated",
               data:userData
           })
        }
        
          }
       })
       }
       else{
           console.log(error)
       }
    }
   
   catch(err){
       console.log(err)
   }
   
}

const verifyUserEmail=async (req,res)=>{

    let user=await userModel.findOne({email:req.body.email})

    if(!user)
    {
        res.json({
            statusCode:400,
            errors:"EmailId does not exists"
        })
    }
    else{

         const access_token = createAccessToken({id: user._id})

         let link=`${process.env.BASE_URL}/reset-password/${user._id}/${access_token}`
         console.log(link)

          console.log( access_token )
        
        await sendMail(
            user.email,
            "Password Reset",
            {
                name:user.firstName,
                link:link,
            },
            './template/requestResetPassword.handlebars'
        )
        res.json({
            statusCode:200,
            message:"Email sent successfully"
         })
        
    }
    
}


 const verifyToken=async (req,res)=>{

      let user=await userModel.findOne({_id:req.params.id})
      if(!user)
      {
          res.json({
              statusCode:400,
              message:"Invalid link"
          })
      }
      console.log(user._id)

      console.log(req.params.token)

      const token = jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET,(err, decoded)=>{
        if (err) {
            console.log(' link expired');
            res.json({
                statusCode:400,
                errors:"Invalid link or link expired"
             })
           }
            else{
                res.json({
                    statusCode:200,
                    message:"valid link "
                       })
               }
      }) 
         
 }

 const resetPassword= async (req,res)=>{

    try 
    {
    
          console.log(req.params.id)
           let id=req.params.id
    
           const user =await userModel.findById(req.params.id)
           console.log(user)
     
           if (!user) return res.status(400).json({
               errors:"invalid link or expired"
            });

 
           const token = jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET,async(error,decoded)=>{
            if (error) {
                console.log('invalid link');
                return res.status(401).json({
                  errors: 'invalid link or link expired'
                });
              } 

              else{
                  console.log(req.body)

           let encryptedpasssword=await hashPassword(req.body.ConfirmPassword)
           req.body.password=encryptedpasssword
      

     
           await userModel.updateOne(
                           { _id:id},
                           { $set: { password: req.body.password} },
                           { new: true }
                      );
     
            await user.save();
           
            sendMail(
                     user.email,
                     "Password Reset Successfull",
                     {
                          name: user.firstName,
                      },
                       "./template/resetPassword.handlebars"
                    );

                    res.json({
                        statusCode:200,
                        message:"Password reset is successfull"
                    })

     
           

        }
    })   
 
   } 
   catch (error) {
     res.send("An error occured");
     console.log(error);
   }
 }

 const createActivationToken = (payload) => {
    return jwt.sign(payload,'secret', {expiresIn: '5m'})
}

 const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
}

module.exports={StoreUserInfo, verifyLogin,verifyUserEmail,activateEmail,verifyToken,resetPassword}