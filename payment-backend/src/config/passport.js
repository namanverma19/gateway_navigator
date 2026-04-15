import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load env variables agar file akeli test karni ho (optional)
dotenv.config();

// 1. User ki ID ko session/cookie mein save karna
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// 2. Cookie se user ki ID nikal kar DB mein dhoondna
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// 3. Google Strategy Setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // 🟢 STEP 1: Pehle EMAIL se dhoondo, kyunki email unique hota hai
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // Agar user pehle se hai, par usne pehli baar Google use kiya hai (Google ID missing hai)
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save(); // Uske purane account mein Google ID link kar di
            }
            // User ko login karwa do
            return done(null, user);
        } else {
            // 🟢 STEP 2: Agar user bilkul NAYA hai, toh naya account banao
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value
            });
            return done(null, user);
        }
    } catch (err) {
        return done(err, null);
    }
}));


export default passport;