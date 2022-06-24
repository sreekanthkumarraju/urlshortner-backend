const nodemailer=require('nodemailer')
const { verifyUserEmail } = require('../controllers/function')
const fs=require('fs')
const path=require('path')
const handlebars=require('handlebars')

const sendMail=async (email,subject,payload,template)=>{

    try{

        const transporter=nodemailer.createTransport({
            host:process.env.HOST,
            service:process.env.SERVICE,
            port:25,
            secure:false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        let source=fs.readFileSync(path.join(__dirname,template),'utf-8')
        let compiledtemplate=handlebars.compile(source)

        await transporter.sendMail({
            from:process.env.USER,
            to:email,
            subject:subject,
            html:compiledtemplate(payload)

        })



        console.log('email sent successfully')
        

    }catch(err){
        console.log(err)

    }
}

module.exports=sendMail