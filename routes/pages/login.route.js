const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../../lib/database')

router.get('/', async (req, res) => {
	res.render('login')
})

router.post('/', (req, res) => {
	let { email, password } = {
		email: req.body.email.trim(),
		password: req.body.password.trim(),
	}
	db.query(`SELECT dcove.users.id as id, email, password, role_id, u_company as comp FROM dcove.users, dcove.login WHERE dcove.users.login_id = dcove.login.id AND email = "${email}" LIMIT 1;`, (err, rows) => {
        
		if (!err) {
            if (bcrypt.compareSync(password, rows[0].password) && rows.length > 0) {
                req.session.uuid = rows[0].id;
                req.session.role = rows[0].role_id
                req.session.comp = rows[0].comp
                
                switch(req.session.role) {
                    case 1:
                      res.redirect('/admin')
                      break;
                    case 2:
                      res.redirect('/tc')
                      break;
                    case 3:
                      res.redirect('/cashier');
                      break;
                    case 4:
                      res.redirect('/admin');
                      break;
                    default:
                      res.redirect('/')
                  }
                
            } else {
                res.redirect('/login')
            }
        } else {
            console.log(err)
        }

	})
    
  
    
})

module.exports = router