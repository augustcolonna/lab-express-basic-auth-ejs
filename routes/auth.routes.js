const router = require('express').Router();
const User = require('../models/User.model')
const bcryptjs = require('bcryptjs');
const saltRounds = 13;

const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

// home page
router.get("/", (res, req) => {
    res.render('index')
})

//display signup from - GET
router.get('/signup', (req, res) => {
    res.render('auth/signup');
})

//create new user - POST
router.post('signup', async (req, res, next) => {
   try{
    const potentialUser = await User.findOne({ username: req.body.username })
    if(!potentialUser){
        if(pwdRegex.test(req.body.password)) {
            const salt = bcryptjs.genSaltSync(saltRounds)
            const passwordHash = bcryptjs.hashSync(req.body.password, salt)
            await User.create({username: req.body.username, passwordHash})
            res.redirect('/auth/login');
            }
        }else{
            res.render('auth/signup', {
                errorMessage: 'Username has already been taken'
            })
        }
   }
   catch(error){
    console.log(error)
   }   
});

//display login - GET
router.get('/login', (req, res) => {
    res.render('auth/login')
});

//take values and check against DB
router.post('login', async (req, res) => {
    console.log(req.session)
    try{
        const foundUser = await User.findOne({ username: req.body.username })
        console.log(foundUser)
        if(foundUser){
            const passwordMatch = bcryptjs.compareSync(req.body.password, foundUser.passwordHash)
        }
        if(passwordMatch){
            req.session.foundUser =  { username: foundUser.username }
            res.redirect('/profile')      
         }
        else {
            res.redirect('auth/login')
        }
    }
    catch(error){
        console.log(error)
    }
})

router.get('/profile', (req,res) => {
    res.render('/users/profile');
})

module.exports = router;