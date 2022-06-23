function adminAuth (req, res, next) {
    switch(req.session.role) {
        case 1:
            next();
            break;
        case 2:
          res.redirect('/')
          break;
        case 4:
            next();
            break;
        default:
            res.redirect('/')
      }    
}

module.exports = {
    adminAuth
}