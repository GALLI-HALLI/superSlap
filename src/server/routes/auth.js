const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const path = require('path');

//DB
const dotenv = require('dotenv');
dotenv.config({path: 'src/server/key.env'});
const User = require("../models/User");

router.get('/login', (req, res)=>{
    res.render(path.join(__dirname, "../../view/login.ejs"))
})

router.post('/signup', [
    check("id", "6자 이상의 아이디를 입력해 주세요").isLength({//이메일 할거면 isEmail도 있음
        min: 6
    }),
    check("password", "6자 이상의 비밀번호를 입력해 주세요").isLength({
        min: 6
    }),
    check("name", "닉네임을 입력해 주세요").isLength({
        min: 1
    }),
], async (req, res)=>{
    const {password, id, name} = req.body;

    //input 조건에 맞는지 확인(check에서 실패할경우 여기로 들어감)
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        // email을 비교하여 user가 이미 존재하는지 확인
        let user1 = await User.findOne({ id });
        if (user1) {
          return res
            .status(400)
            .json({ errors: [{ msg: "아이디 이미 존재" }] });
        }
        let user2 = await User.findOne({ name });
        if (user2) {
            return res
            .status(400)
            .json({ errors: [{ msg: "닉네임 이미 존재" }] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        user = new User({
            name,
            id,
            password: hashedPassword,
        });
    
        await user.save(); // db에 user 저장

        // res.send("Success");

    }catch(error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }

    const token = await JWT.sign({
        id
    }, process.env.JWT_KEY, { //여기 있는거 시크릿키임
        expiresIn: 3600000 //2시간동안 토큰 있음
    });

    res.json({
        token
    });
});


router.post('/login', async (req,res) => {
    const {password, id} = req.body;

    let user = await User.findOne({ "id" : id});

    if(!user){
        console.log("here");
        // console.log(res.json({
        //     success: false,
        //     msg: "유효하지 않은 아이디입니다."
        // }));
        const result = {success: false,
            msg: "유효하지 않은 아이디입니다."};
        console.log(result);
        return res.json(result);
        // return res.status(400).json({
        //     "errors": [
        //         {
        //             "msg": "유효하지 않은 아이디입니다.",
        //         }
        //     ],
        //     success: false
        // });
    }

    console.log("아이디 있음");
    let isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.send("비밀번호");
        // return res.send({
        //     success:false,
        //     msg:"비밀번호가 틀렸습니다"
        // }));
        // return res.status(400).json({
        //     "errors": [
        //         {
        //             "msg": "비밀번호가 틀렸습니다",
        //             success: false
        //         }
        //     ]
        // });
    }
    console.log("비밀번호 확인");
    const token = await JWT.sign({
        id
    }, process.env.JWT_KEY, { //여기 있는거 시크릿키임
        expiresIn: 3600000 //2시간동안 토큰 있음
    });

    return res.json({
        token, success:true
    });
});

module.exports = router;