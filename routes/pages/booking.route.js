const router = require("express").Router();

router.get("/", (req, res) =>{
    try {
        res.render('bookingpage')
    }
    catch {
        throw err;
    } 
});


module.exports = router