const express=require('express')

const router=express.Router()
const {shorten}=require('../URL_shortner_service/url')
const {redirect}=require('../URL_shortner_service/redirect')
const {StoreUserInfo, verifyLogin,verifyUserEmail,activateEmail,verifyToken,resetPassword}=require('../controllers/function')

router.route('/register').post(StoreUserInfo)

router.route('/login').post(verifyLogin)

router.route('/forgotpassword').post(verifyUserEmail)

router.route('/activate-user').post(activateEmail)

router.route('/reset-password/:id/:token').get(verifyToken)

router.route('/reset-password/:id/:token').post(resetPassword)
router.route('/shorten').post(shorten)
router.route('/:code').get(redirect)


module.exports=router