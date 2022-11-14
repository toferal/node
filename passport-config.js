const bcrypt = require("bcryptjs");
const LocalStrategy = require('passport-local').Strategy;

function init(passport, getUesrByEmail, getUserById) {
  const authenticator = async (email, password, done) => {
    const user = getUesrByEmail(email);
    if (user == null) {
      return done(null, false, { message: "worng emaill address" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "password is incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "email", passwordField: 'password' }, authenticator));

  passport.serializeUser((user, done) => {
  console.log(getUserById(user.id));
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    console.log(getUserById(id));
   return done(null, getUserById(id));
  });
}

module.exports = init;
