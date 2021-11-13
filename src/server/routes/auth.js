const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const path = require("path");
const passport = require("../config/passport");
const asyncHandler = require("express-async-handler");

//DB
const User = require("../models/User");

// google-oauth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }) // 구글 로그인 페이지로 이동하여 로그인 이루어짐
);

router.get(
  "/google/callback", // 로그인 성공 시 callbackURL 설정에 따라 이 라우터로 이동
  passport.authenticate("google"),
  authSuccess // 여기서 callback 함수 호출
);

function authSuccess(req, res) {
  //   res.redirect('/post/public');    // ########### 로그인 후, 나중에 추가 ##########################
}

router.get("/login", (req, res) => {
  // res.render(path.join(__dirname, "../../view/login.ejs"));  // ############# 프론트엔드 합칠 때 수정 ###
});

router.post(
  "/signup",
  [
    check("id", "6자 이상의 아이디를 입력해 주세요").isLength({
      //이메일 할거면 isEmail도 있음
      min: 6,
    }),
    check("password", "6자 이상의 비밀번호를 입력해 주세요").isLength({
      min: 6,
    }),
    check("name", "닉네임을 입력해 주세요").isLength({
      min: 1,
    }),
  ],
  asyncHandler(async (req, res) => {
    const { password, id, name } = req.body;

    //input 조건에 맞는지 확인(check에서 실패할경우 여기로 들어감)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // email을 비교하여 user가 이미 존재하는지 확인
    let user1 = await User.findOne({ id });
    if (user1) {
      return res.status(400).json({ errors: [{ msg: "아이디 이미 존재" }] });
    }
    let user2 = await User.findOne({ name });
    if (user2) {
      return res.status(400).json({ errors: [{ msg: "닉네임 이미 존재" }] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      id,
      password: hashedPassword,
      type: "superslap",
    });

    await user.save(); // db에 user 저장

    const token = await JWT.sign(
      {
        id,
      },
      process.env.JWT_KEY,
      {
        //여기 있는거 시크릿키임
        expiresIn: 3600000, //2시간동안 토큰 있음
      }
    );

    res.json({
      token,
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { password, id } = req.body;
    let user = await User.findOne({ id: id, type: "superslap" });
    if (!user) {
      return res.json({ success: false, msg: "유효하지 않은 아이디입니다." });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, msg: "유효하지 않은 비밀번호입니다." });
    }
    const token = await JWT.sign(
      {
        id,
      },
      process.env.JWT_KEY,
      {
        //여기 있는거 시크릿키임
        expiresIn: 3600000, //2시간동안 토큰 있음
      }
    );

    // res.setheader("x-auth-token",token);
    return res.json({
      token,
      success: true,
    });
  })
);

router.post("/kakao", (req, res) => {
  console.log(req.body);
  User.findOne({ id: req.body.id, type: "kakao" }).then((existingUser) => {
    if (!existingUser) {
      new User({
        id: req.body.id,
        name: req.body.name,
        type: req.body.type,
      }).save();
    }
  });
});

module.exports = router;
