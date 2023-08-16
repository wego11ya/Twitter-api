const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcryptjs");
const { newError } = require("../helpers/error-helper");
const { User } = require("../models");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
// set up Passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: "account",
      passwordField: "password",
    },
    // authenticate user
    async (account, password, cb) => {
      try {
        const user = await User.findOne({ where: { account } });
        if (!user) throw newError(400, "帳號或密碼輸入錯誤!");
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) throw newError(400, "帳號或密碼輸入錯誤!");
        return cb(null, user);
      } catch (err) {
        cb(err, false);
      }
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
    try {
      const user = await User.findByPk(jwtPayload.id);
      if (user) return cb(null, user);
    } catch (err) {
      cb(err, false);
    }
  })
);

module.exports = passport;
