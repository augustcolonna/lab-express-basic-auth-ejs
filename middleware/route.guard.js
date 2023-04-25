//is user logged in

const isLoggedIn = (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/login')
    }
    next()
}


const isLoggedOut = (res, req, next) => {
    if(req.session.user) {
        res.redirect('/')
    }
    next()
}

module.exports = {isLoggedIn, isLoggedOut}