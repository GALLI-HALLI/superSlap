const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../models/User");

const dotenv = require("dotenv");
dotenv.config();

// Google-oauth
passport.serializeUser(function (user, done) {
  // user를 session에 저장
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  // 이후 서버에 request가 오는 경우 매번 이 함수 실행하여 session에서 user를 꺼내 user 복원
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log("profile: ", profile);
      User.findOne({ id: profile.email, type: "google" }).then(
        (existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            new User({
              id: profile.email,
              name: profile.displayName,
              type: profile.provider,
            })
              .save()
              .then((user) => {
                done(null, user);
              });
          }
        }
      );
    }
  )
);

// Kakao oauth
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_SECRET,
      redirectURI: "http://localhost:5000/auth/kakao/callback",
      passReqToCallback: true,
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("profile: ", profile);
      User.findOne({ id: profile.id, type: "kakao" }).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({
            id: profile.id,
            name: profile.nickname,
            type: profile.provider,
          })
            .save()
            .then((user) => {
              done(null, user);
            });
        }
      });
    }
  )
);

module.exports = passport;
