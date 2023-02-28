const express=require("express")
const user=require("../controllers/user")
const checkAuth=require("../middlewares/checkAuth")
const router=express.Router()
router.post('/signup',user.post_user)
router.post('/login',user.login_user)
router.get('/p',checkAuth,(req,res,next)=>{
    res.send('hello')
})
module.exports=router;