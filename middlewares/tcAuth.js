function tcAuth (req, res, next) {
    switch(req.session.role) {
        case 1:
            res.redirect('/')
            break;
        case 2:
          next()
          break;
        case 4:
            res.redirect('/')
            break;
        default:
            res.redirect('/')
      }    
}

module.exports = {
    adminAuth
}