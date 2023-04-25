const express = require('express')
const router = express.Router();
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
router.post('/signup', async (req, res, next) => {
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
router.post('/login', async (req, res) => {
    console.log(req.session)
    try{
        const userExists = await User.findOne({ username: req.body.username })
        console.log(user)
        if(!!user){
            if(bcryptjs.compareSync(req.body.password, user.passwordHash)){
                req.session.user =  { username: user.username }
                res.redirect('/profile')
            }
            else {
                res.render('auth/login', { errorMessage: 'Wrong password, try again' })   
            }}
            else {
                res.render('auth/login', { errorMessage: 'That username does not exist' })
            }
    }
    catch(error){
        console.log(error)
    }
})

module.exports = router;