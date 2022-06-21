function authUser (req, res, next) {
    if(req.session.uuid == null){
        res.redirect('/login')
    } else {
        next()
    }
}

module.exports = {
    authUser
}