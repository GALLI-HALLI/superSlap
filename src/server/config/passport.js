const passport         = require('passport');
const GoogleStrategy   = require('passport-google-oauth2').Strategy;
const dotenv = require("dotenv");

dotenv.config();

passport.serializeUser(function(user, done) {   // user를 session에 저장
  done(null, user);
});
passport.deserializeUser(function(user, done) { // 이후 서버에 request가 오는 경우 매번 이 함수 실행하여 session에서 user를 꺼내 user 복원
  done(null, user);
});

passport.use(new GoogleStrategy(
  {
    clientID      : process.env.GOOGLE_CLIENT_ID,
    clientSecret  : process.env.GOOGLE_SECRET,
    callbackURL   : '/auth/google/callback',  // 구글에 로그인이 이루어진 후 구글이 다시 사이트로 돌려보내는 주소 설정하는 부분
    passReqToCallback   : true
  }, function(request, accessToken, refreshToken, profile, done){
    console.log('profile: ', profile);
    let user = profile;

    done(null, user);   // user를 passport.serializeUser에 전달
  }
));

module.exports = passport;