const express=require('express')
const router=express.Router()
const {shorten}=require('../URL_shortner_service/url')
const {redirect}=require('../URL_shortner_service/redirect')
const main=require('../controllers/function')

router.route('/register').post(main.StoreUserInfo)

router.route('/login').post(main.verifyLogin)

router.route('/forgotpassword').post(main.verifyEmail)

router.route('/activate-user').post(main.activateEmail)

router.route('/reset-password/:id/:token').get(main.verifyToken)

router.route('/reset-password/:id/:token').post(main.resetPassword)

router.route('/shorten').post(shorten)

router.route('/:code').get(redirect)


module.exports=router