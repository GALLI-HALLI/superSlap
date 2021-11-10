const express  = require('express');
const router   = express.Router();
const passport = require('../config/passport');

router.get('/login', function(req,res){
  res.render('auth/login');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })   // 구글 로그인 페이지로 이동하여 로그인 이루어짐
);

router.get('/google/callback',  // 로그인 성공 시 callbackURL 설정에 따라 이 라우터로 이동
  passport.authenticate('google'), authSuccess  // 여기서 callback 함수 호출
);

function authSuccess(req, res) {
  res.redirect('/');
}

module.exports = router;
