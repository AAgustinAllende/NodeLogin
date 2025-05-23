import dotenv from "dotenv"
dotenv.config()

console.log("MONGO_URI:", process.env.MONGO_URI);  
console.log("CLIENT_ID:", process.env.CLIENT_ID);

import express from "express";
import engine from "ejs-mate";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import './database.js';
import './passport/local-auth.js';
import flash from "connect-flash";
import indexRoutes from "./routes/index.js";
import User from "./models/user.js"; 
import "./database.js"


const app = express();


// Directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Settings
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "secretsession",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));


// Autenticación Google
passport.use(new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/perfil`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let existingUser = await User.findOne({ googleId: profile.id });
      if (!existingUser) {
        existingUser = new User({
          googleId: profile.id,
          username: profile.displayName,
        });
        await existingUser.save();
      }
      return done(null, existingUser);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Rutas de autenticación con Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/perfil',
  passport.authenticate('google', { failureRedirect: "/registro" }),
  (req, res) => {
    res.redirect("/perfil");
  }
);

// Middleware para mensajes flash
app.use((req, res, next) => {
    res.locals.signupMessage = req.flash("signupMessage");
    next();
});
app.use((req,res,next)=>{
  res.locals.isAuthenticated=req.isAuthenticated();
  res.locals.user=req.user || null;
  next();
})

// Routes
app.use("/", indexRoutes);

const PORT = 8000;
const server = app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`);
});
