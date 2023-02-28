const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token=req.headers.authorization.split(" ")[2]
    console.log(token)
    const decoded=jwt.verify(token,process.env.SECRET_KEY)
    req.userData=decoded
    next()
  } catch (error){
    res.status(401).json({
        error:error,
        message:"fn"
        
    })
  }
};
