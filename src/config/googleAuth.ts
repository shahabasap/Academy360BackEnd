import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authService  from '../services/AuthService';



passport.use(new GoogleStrategy({
  clientID: process.env.Client_ID as string,
  clientSecret: process.env.Client_secret as string,
  callbackURL: 'http://localhost:5000/auth/google/callback',
},

async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await authService.findOrCreateUser(profile);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await authService.findUserById(id as string);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
