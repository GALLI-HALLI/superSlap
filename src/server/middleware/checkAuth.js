const JWT = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config({path: 'src/server/key.env'});

module.exports = async (req,res,next) => {
    // const token = req.header('x-auth-token');
    const token = localStorage.getItem('jwt');

    if(!token){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "no token found",
                }
            ]
        });
    }
    try{
        let user = await JWT.verify(token, process.env.JWT_KEY);
        req.user = user.id;
        next();
    }catch(error){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "유효하지 않은 토큰",
                }
            ]
        });
    }
}