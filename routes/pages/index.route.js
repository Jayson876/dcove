const router = require("express").Router()

router.get("/", (req, res) =>{
    try {
        res.render('index')
    }
    catch {
        throw err;
    } 
});

module.exports = router