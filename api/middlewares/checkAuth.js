const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token=req.headers.authorization.split(" ")[1]
    console.log(token)
    console.log("modonfonfnl")
    const decoded=jwt.verify(token,process.env.SECRET_KEY)
    req.userData=decoded
    console.log(req.userData)
    next()
  } catch (error){
    res.status(401).json({
        error:error,
        message:"fn"
        
    })
  }
};
