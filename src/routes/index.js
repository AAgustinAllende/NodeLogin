import { Router } from "express";
import passport from "passport";

const router = Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get("/login", (req,res,next)=>{
    res.render('login');
});

router.post("/login", passport.authenticate('login', {
    successRedirect: "/perfil",
    failureRedirect:"/registro",
    failureFlash:true
}))

// Ruta para mostrar el formulario de registro
router.get('/registro', (req, res) => {
    res.render('registro');
});

// Ruta para procesar el formulario de registro
router.post('/registro', passport.authenticate('registro', {
    successRedirect: '/perfil',
    failureRedirect: '/registro',
    failureFlash: true  
}));

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);  
        }
        res.redirect("/");  // Redirige al usuario después de cerrar sesión
    });
});


// Ruta para perfil (luego de autenticacion)
router.get('/perfil', isAuthenticated, (req, res, next) => {
    res.render('perfil');  
});

function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

export default router;
