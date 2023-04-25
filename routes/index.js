const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middleware/route.guard')
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('/users/profile', { user: req.session.user })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err)
    res.redirect('/')
  })
})

module.exports = router;
