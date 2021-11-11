const passport         = require('passport');
const GoogleStrategy   = require('passport-google-oauth2').Strategy;
const dotenv = require("dotenv");
const User = require("../models/User");
const bcrypt = require("bcrypt");

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
    User.findOne({"id": profile.email}).then((existingUser) => {
      if (existingUser) {
        done(null, existingUser);
      } else {
        new User({"id" : profile.email,
                  "name" : profile.displayName,
                  "password" : profile.sub
                }).save().then((user) => {
                  done(null, user);
                })
        // const hashedPassword = bcrypt.hash(profile.sub, 10);
        // let gUser = new User({"id" : profile.email,
        //           "name" : profile.displayName,
        //           "password" : hashedPassword
        //         })
        // gUser.save().then((user) => {
        //   done(null, user);
        // })
      }
    });
  }
));

module.exports = passport;