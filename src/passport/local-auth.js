import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import User from "../models/user.js";  

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const usuario1 = await User.findById(id);
    done(null, usuario1);
});

passport.use("registro", new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const usuario = await User.findOne({ email: email });
        if (usuario) {
            req.flash("signupMessage", "Ya existe un usuario registrado");
            return done(null, false);
        } else {
            const newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            await newUser.save();
            return done(null, newUser);
        }
    } catch (error) {
        return done(error);
    }
}));

passport.use("login", new localStrategy({
    usernameField:"email",
    passwordField:"password",
    passReqToCallback:true
}, async (req, email, password, done)=>{

    const usuario = await User.findOne({email:email});
    if(!usuario){
        return done (null, false, req.flash("signupMessage","Usuario no encontrado"));
    }
    if (!usuario.comparePassword(password)){
        return done (null, false, req.flash("signupMessage","Contraseña incorrecta"));
    }
    done(null, usuario);
}))

