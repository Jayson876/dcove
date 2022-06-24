const router = require("express").Router();
const { getQuery } = require("../../services/getquery")
const { authUser } = require("../../middlewares/auth")
const { adminAuth } = require("../../middlewares/adminAuth")
const dateFormatter = require('../../services/dateFormatter')
const receipt = require('../../services/receiptnum')
const db = require('../../lib/database')
const bcrypt = require('bcrypt')

router.get("/", authUser, adminAuth, (req, res) =>{
    try {
        res.redirect('/admin/dashboard')
    }
    catch {
        throw err;
    } 
});
router.get("/dashboard", authUser, adminAuth, async (req, res) =>{
    try {
        var userRole = req.session.role
        var currentDate = dateFormatter.dateFormatter();
        var currentTime = dateFormatter.timeFormatter();
        var adultCount = await getQuery(`SELECT sum(adults) as sum FROM dcove.booking, dcove.guests, dcove.shedule WHERE dcove.guests.id = dcove.booking.guest_id AND dcove.booking.shedule_id = dcove.shedule.id AND exc_date > ${currentDate}`)
        var infantCount = await getQuery(`SELECT sum(infants) as sum FROM dcove.booking, dcove.guests, dcove.shedule WHERE dcove.guests.id = dcove.booking.guest_id AND dcove.booking.shedule_id = dcove.shedule.id AND exc_date > ${currentDate}`)
        var gross = await getQuery(`SELECT sum(dcove.payment.tot_amt) as sum FROM dcove.booking, dcove.payment WHERE dcove.booking.id = dcove.payment.booking_id AND payment.status_id = 2;`);
        var pbooking = await getQuery(`SELECT count(dcove.booking.id) as count FROM dcove.booking, dcove.shedule WHERE dcove.booking.shedule_id = dcove.shedule.id AND exc_date > ${currentDate}`)
        var users = await getQuery('SELECT users.id as id, u_fname, u_lname, c_name, role FROM dcove.users, dcove.company, dcove.login, dcove.role  WHERE dcove.users.u_company = dcove.company.id AND dcove.users.login_id = dcove.login.id AND dcove.login.role_id = dcove.role.id')
        var programs = await getQuery('SELECT * FROM dcove.programs;')
        var bookings = await getQuery(`SELECT programs.program, guests.adults, guests.infants,  company.c_name, booking.exc_date, shedule.shedule, payment_status.status FROM dcove.booking, dcove.guests, dcove.company, dcove.programs, dcove.shedule, dcove.payment, dcove.payment_status WHERE dcove.booking.program_id = dcove.programs.id AND dcove.booking.guest_id = dcove.guests.id AND dcove.booking.id = dcove.payment.booking_id AND dcove.payment.status_id = dcove.payment_status.id AND dcove.booking.shedule_id = dcove.shedule.id AND dcove.guests.tourcomp_id = dcove.company.id AND exc_date > ${currentDate} ORDER BY exc_date`)
        res.render('admindashboard',{users, bookings, pbooking, adultCount, infantCount, gross, programs, userRole});
        
    }
    catch {
        throw err;
    } 
});
router.get("/programs", authUser, adminAuth, async (req, res) =>{
    try {
        var userRole = req.session.role
        var  programs = await getQuery('SELECT * FROM dcove.programs;')
        res.render('adminprograms',{userRole, programs})
    }
    catch {
        throw err;
    } 
});
router.post('/program/new', authUser, adminAuth, function(req, res) {
    
    var sql = "INSERT INTO dcove.programs (`program`, `desc`, `price`, `pic_url`) VALUES ('" + req.body.name + "', '" + req.body.desc + "',  '" + req.body.price + "', '" + req.body.pic_url + "')"
    
    db.query(sql, (err, rows, fields) =>{
        if(!err)
        {
            res.redirect('/admin/programs')   
        }
        else
        {
            console.log(err);
        }
    })
}); 
router.get("/program/:id", authUser, adminAuth, async (req, res) =>{
    try {
        var userRole = req.session.role
        var  programs = await getQuery(`SELECT * FROM dcove.programs WHERE id = ${req.params.id};`)
        res.render('adminprogramview',{userRole, programs})
     }
    catch {
 
    } 
 })
router.get('/program/:id/delete', authUser, adminAuth, function(req, res) {

    var sql = `DELETE FROM dcove.programs WHERE id = ${req.params.id} `
    
    db.query(sql, (err, rows, fields) =>{
        if(!err)
        {
            res.redirect('/admin/programs')
        }
        else
        {
            console.log(err);
        }
    })
}); 
router.post('/programs/program/update', authUser, adminAuth, function(req, res) {

    var sql = `UPDATE dcove.programs SET program = "${req.body.name}", programs.desc = "${req.body.desc}", price = ${req.body.price}, pic_url = "${req.body.pic_url}" WHERE id = ${req.body.id}`
    
    db.query(sql, (err, rows, fields) =>{
        if(!err)
        {
            res.redirect('/admin/programs')
        }
        else
        {
            console.log(err);
        }
    })
}); 
router.get("/bookings", authUser, adminAuth, async (req, res) =>{
    try {
        var userRole = req.session.role
        var currentDate = dateFormatter.dateFormatter();
        var currentTime = dateFormatter.timeFormatter();
        var hotels = await getQuery("SELECT * FROM dcove.hotels;")
        var ptype = await getQuery("SELECT * FROM dcove.payment_type;")
        var pstatus = await getQuery("SELECT * FROM dcove.payment_status;")
        var programs = await getQuery("SELECT * FROM dcove.programs;")
        var tourCompanies = await getQuery("SELECT * FROM dcove.company WHERE company_type = 2")
        var bookings = await getQuery(`SELECT booking.id as id, programs.program, guests.adults, guests.infants,  company.c_name, booking.exc_date, shedule.shedule, payment.tot_amt, payment_status.status FROM dcove.booking, dcove.guests, dcove.company, dcove.programs, dcove.shedule, dcove.payment, dcove.payment_status WHERE dcove.booking.program_id = dcove.programs.id AND dcove.booking.guest_id = dcove.guests.id AND dcove.booking.id = dcove.payment.booking_id AND dcove.payment.status_id = dcove.payment_status.id AND dcove.booking.shedule_id = dcove.shedule.id AND dcove.guests.tourcomp_id = dcove.company.id AND exc_date > ${currentDate} ORDER BY exc_date`)
        var shedule = await getQuery("SELECT * FROM dcove.shedule;")
        res.render('adminbookings', {bookings, hotels, tourCompanies, programs, shedule, ptype, pstatus, userRole})
    }
    catch {
        throw err;
    } 
});
router.get("/bookings/:id", authUser, adminAuth, async (req, res) =>{
   try {
        var userRole = req.session.role
        var currentDate = dateFormatter.dateFormatter();
        var currentTime = dateFormatter.timeFormatter();
        var bookings = await getQuery(`SELECT booking.id as id, program_id, programs.program, guests.adults, guests.infants, hotel_id, hotels.hotel,tourcomp_id, company.c_name, booking.exc_date, shedule.shedule, shedule_id, status_id, payment.tot_amt, payment_status.status, tot_amt as total, p_type_id, payment_type, status, trans_date, receipt_num, fname, lname, g_cell, g_email FROM dcove.contact_details, dcove.booking, dcove.guests, dcove.hotels, dcove.company, dcove.programs, dcove.shedule, dcove.payment,dcove.payment_type, dcove.payment_status WHERE dcove.booking.id = dcove.contact_details.booking_id AND dcove.booking.program_id = dcove.programs.id AND dcove.booking.guest_id = dcove.guests.id AND dcove.guests.hotel_id = dcove.hotels.id AND dcove.booking.id = dcove.payment.booking_id AND dcove.payment.p_type_id = dcove.payment_type.id AND dcove.payment.status_id = dcove.payment_status.id AND dcove.booking.shedule_id = dcove.shedule.id AND dcove.guests.tourcomp_id = dcove.company.id AND exc_date > ${currentDate} AND dcove.booking.id = ${req.params.id} ORDER BY exc_date`)
        var pstatus = await getQuery(`SELECT * FROM dcove.payment_status WHERE id != ${bookings[0].status_id};`)
        var ptype = await getQuery(`SELECT * FROM dcove.payment_type WHERE id != ${bookings[0].p_type_id};`)
        var shedule = await getQuery(`SELECT * FROM dcove.shedule WHERE id != ${bookings[0].shedule_id};`)
        var programs = await getQuery(`SELECT * FROM dcove.programs WHERE id != ${bookings[0].program_id};`)
        var tourCompanies = await getQuery(`SELECT * FROM dcove.company WHERE company_type = 2 AND id != ${bookings[0].tourcomp_id} `)
        var hotels = await getQuery(`SELECT * FROM dcove.hotels WHERE dcove.hotels.id != ${bookings[0].hotel_id} ;`)
        var paymentInfo = await getQuery(`SELECT tot_amt as total, payment_type, status, trans_date, receipt_num FROM dcove.payment, dcove.payment_type, dcove.payment_status WHERE dcove.payment.status_id = dcove.payment_status.id AND dcove.payment.p_type_id = dcove.payment_type.id AND dcove.payment.booking_id = ${req.params.id};`)
        var contactInfo = await getQuery(`SELECT * FROM dcove.contact_details WHERE booking_id = ${req.params.id};`)
        var excDate = await dateFormatter.dateFormatterParam(bookings[0].exc_date)
        res.render('adminbookingview', {bookings, hotels, tourCompanies, programs, shedule, ptype, pstatus, paymentInfo, contactInfo, excDate, userRole})
    }
   catch {

   } 
})
router.post('/bookings/create', authUser, adminAuth, function(req, res) {
    
    var sql = "INSERT INTO dcove.guests (`adults`, `infants`, `hotel_id`, `tourcomp_id`) VALUES ('" + req.body.adults + "', '" + req.body.infants + "',  '" + req.body.hotel + "', '" + req.body.tourCompany + "')"
    
    db.query(sql, (err, rows, fields) =>{
        if(!err)
        {
            var guestID = rows.insertId;
            var sql2 = "INSERT INTO dcove.booking (`guest_id`, `program_id`, `exc_date`, `shedule_id`) VALUES ('"+ guestID +"', '" + req.body.programs + "', '" + req.body.exc_date + "', '" + req.body.shedule + "')"
            db.query(sql2, (err, rows, fields) =>{
                if(!err)
                {
                    var bookingID = rows.insertId;
                    var sql3 = "INSERT INTO dcove.contact_details (`booking_id`, `fname`, `lname`, `g_cell`, `g_email`) VALUES ('"+ bookingID +"', '" + req.body.fname + "', '" + req.body.lname + "',  '" + req.body.cell + "', '" + req.body.email + "')"
                    db.query(sql3, async (err, rows, fields) =>{
                        if(!err)
                        {
                            var programPrice = await getQuery(`SELECT * FROM dcove.programs WHERE id = ${req.body.programs};`);
                            var getPrice = programPrice[0].price
                            var transDate = dateFormatter.dateFormatter();
                            var totAmount = (parseInt(req.body.adults) + parseInt(req.body.infants))* getPrice
                            var rNum = receipt.getReceiptNumber();
                            var sql4 = "INSERT INTO dcove.payment (`booking_id`, `tot_amt`, `trans_date`, `status_id`, `p_type_id`, `receipt_num`) VALUES ('"+ bookingID +"', '" + totAmount + "', '" + transDate + "',  '" + req.body.pstatus + "', '" + req.body.ptype +"', '" + rNum + "')"
                            db.query(sql4, (err, rows, fields) =>{
                                if(!err)
                                {
                                    
                                    res.redirect('/admin/bookings')
                                }
                                else
                                {
                                    console.log(err);
                                }
                            })
                        }
                        else
                        {
                            console.log(err);
                        }
                    })
                }
                else
                {
                    console.log(err);
                }
            })
            
        }
        else
        {
            console.log(err);
        }
    })
}); 
router.post('/bookings/update', authUser, adminAuth, function(req, res) {
    
    var sql = `SELECT * FROM dcove.booking WHERE id = ${req.body.id}`
    db.query(sql, (err, rows, fields) =>{
        if(!err)
        {
            var guestID = rows[0].guest_id;
            var sql2 = `UPDATE dcove.guests SET adults = ${req.body.adults}, infants = ${req.body.infants}, hotel_id = ${req.body.hotel}, tourcomp_id = ${req.body.tourCompany} WHERE id = ${guestID}`    
            db.query(sql2, (err, rows, fields) =>{
                if(!err)
                {
                    var sql3 = `UPDATE dcove.booking SET program_id = ${req.body.programs}, exc_date = "${req.body.exc_date}", shedule_id = ${req.body.shedule} WHERE id = ${req.body.id}; UPDATE dcove.contact_details SET fname = "${req.body.fname}", lname = "${req.body.lname}", g_cell = "${req.body.cell}", g_email = "${req.body.email}" WHERE booking_id = ${req.body.id}`
                    db.query(sql3, async (err, rows, fields) =>{
                        if(!err)
                        {
                            var programPrice = await getQuery(`SELECT * FROM dcove.programs WHERE id = ${req.body.programs};`);
                            var getPrice = programPrice[0].price
                            var totAmount = (parseInt(req.body.adults) + parseInt(req.body.infants))* getPrice
                            var sql4 = `UPDATE dcove.payment SET tot_amt = ${totAmount}, status_id = ${req.body.pstatus}, p_type_id = ${req.body.ptype} WHERE booking_id = ${req.body.id}`
                            db.query(sql4, (err, rows, fields) =>{
                                if(!err)
                                {
                                    
                                    res.redirect('/admin/bookings')
                                }
                                else
                                {
                                    console.log(err);
                                }
                            })
                        }
                        else
                        {
                            console.log(err);
                        }
                    })
                }
                else
                {
                    console.log(err);
                }
            })
            
        }
        else
        {
            console.log(err);
        }
    })
}); 
router.get('/bookings/:id/delete', authUser, adminAuth, function(req, res) {
    var sql1 = `DELETE FROM dcove.contact_details WHERE booking_id = ${req.params.id}; DELETE FROM dcove.payment WHERE booking_id = ${req.params.id};`

    db.query(sql1, (err, rows, fields) =>{
        if(!err)
        {
            var sql2 = `SELECT * FROM dcove.booking WHERE id = ${req.params.id}`
            db.query(sql2, (err, rows, fields) =>{
                if(!err)
                {
                    var guestID = rows[0].guest_id
                    var sql3 = `DELETE FROM dcove.booking WHERE id = ${req.params.id}; DELETE FROM dcove.guests WHERE id = ${guestID};`
                    db.query(sql3, (err,rows, fields) =>{
                        if(!err)
                        {
                            res.redirect('/admin/bookings')
                        }
                        else
                        {
                            console.log(err)
                        }
                    })
                }
                else
                {
                    console.log(err);
                }
            })
        }
        else
        {
            console.log(err);
        }
    })

})
router.get("/usermanagement", authUser, adminAuth,  async (req, res) =>{
   try {
        var userRole = req.session.role
        var role = await getQuery(`SELECT * FROM dcove.role`)
        var role2 = await getQuery(`SELECT * FROM dcove.role WHERE id != 1 AND id != 4`)
        var company = await getQuery(`SELECT * FROM dcove.company WHERE id != 2`)
        var company2 = await getQuery(`SELECT * FROM dcove.company WHERE id != 1 AND id != 2 `)
        var adminShow = await getQuery(`SELECT dcove.users.id as id, u_fname as fname, u_lname as lname, email, c_name as company, role  FROM dcove.users, dcove.login, dcove.company, dcove.role WHERE dcove.users.u_company = dcove.company.id AND dcove.users.login_id = dcove.login.id AND dcove.login.role_id = dcove.role.id AND dcove.users.u_company = 1 ORDER BY role DESC;`)
        var otherUsersShow = await getQuery(`SELECT dcove.users.id as id, u_fname as fname, u_lname as lname, email, c_name as company, role  FROM dcove.users, dcove.login, dcove.company, dcove.role WHERE dcove.users.u_company = dcove.company.id AND dcove.users.login_id = dcove.login.id AND dcove.login.role_id = dcove.role.id AND dcove.login.role_id = 2 ORDER BY role DESC;`)
         res.render('adminusermanage',{userRole, adminShow, otherUsersShow, role, company, role2, company2})
    }
   catch {

   } 
})
router.get("/usermanagement/user/:id", authUser, adminAuth, async (req, res) =>{
    try {
         var userRole = req.session.role
         var userInfo = await getQuery(`SELECT dcove.users.id as id, u_fname as fname, u_lname as lname, email, c_name as company, role, role_id, u_company  FROM dcove.users, dcove.login, dcove.company, dcove.role WHERE dcove.users.u_company = dcove.company.id AND dcove.users.login_id = dcove.login.id AND dcove.login.role_id = dcove.role.id AND dcove.users.id = ${req.params.id};`)
         var company = await getQuery(`SELECT * FROM dcove.company WHERE id != ${userInfo[0].u_company} AND id != 2`)
         var company2 = await getQuery(`SELECT * FROM dcove.company WHERE id != ${userInfo[0].u_company} AND company_type = 2 AND id != 2`)
         var role = await getQuery(`SELECT * FROM dcove.role WHERE id != ${userInfo[0].role_id} `)
         var role2 = await getQuery(`SELECT * FROM dcove.role WHERE id != ${userInfo[0].role_id} AND id != 1 AND id != 4`)
         var userView = await getQuery(`SELECT dcove.users.id as id, u_fname as fname, u_lname as lname, email, c_name as company, role  FROM dcove.users, dcove.login, dcove.company, dcove.role WHERE dcove.users.u_company = dcove.company.id AND dcove.users.login_id = dcove.login.id AND dcove.login.role_id = dcove.role.id AND dcove.users.id = ${req.params.id};`)
         res.render('adminuserview', {userView, userRole, userInfo,company, company2, role, role2})
     }
    catch {
 
    } 
 })
 router.post('/usermanagement/add', authUser, adminAuth, function(req, res) {
    
    console.log(req.body.password)
    var password = bcrypt.hashSync(req.body.password, 10)
    var sql = "INSERT INTO dcove.login (`email`, `password`, `role_id`) VALUES ('" + req.body.email + "', '" + password + "', '" + req.body.role + "')"
    
    db.query(sql, (err, rows, fields) =>{
        if(!err)
        {
            var loginID = rows.insertId;
            var sql2 = "INSERT INTO dcove.users (`u_fname`, `u_lname`, `u_company`, `login_id`) VALUES ('"+ req.body.fname +"', '" + req.body.lname + "', '" + req.body.company + "', '" + loginID + "')"
            db.query(sql2, (err, rows, fields) =>{
                if(!err)
                {
                    res.redirect('/admin/usermanagement')
                }
                else
                {
                    console.log(err);
                }
            })
            
        }
        else
        {
            console.log(err);
        }
    })
}); 
router.post('/usermanagement/user/update', authUser, adminAuth, function(req, res) {
    
    var sql = `SELECT * FROM dcove.users WHERE id = ${req.body.id}`
    db.query(sql, (err, rows, fields) =>{
        if(!err)
        {
            var loginID = rows[0].login_id;
            var sql2 = `UPDATE dcove.login SET email = "${req.body.email}", role_id = "${req.body.role}" WHERE id = "${loginID}"; UPDATE dcove.users SET u_fname = "${req.body.fname}", u_lname = "${req.body.lname}", u_company = "${req.body.company}" WHERE id = "${req.body.id}"; `    
            db.query(sql2, (err, rows, fields) =>{
                if(!err) 
                {
                    res.redirect('/admin/usermanagement')
                }
                else
                {
                    console.log(err);
                }
            })
            
        }
        else
        {
            console.log(err);
        }
    })
}); 
router.get('/usermanagement/user/:id/delete', authUser, adminAuth, function(req, res) {

    var sql = `SELECT * FROM dcove.users WHERE id = ${req.params.id} `
    
    db.query(sql, (err, rows, fields) =>{
        if(!err)
        {
            var loginID = rows[0].login_id
            var sql2 = `DELETE FROM dcove.users WHERE id = ${req.params.id}; DELETE FROM dcove.login WHERE id = ${loginID}; `
            db.query(sql2, (err, rows, fields) =>{
                if(!err)
                {
                    res.redirect('/admin/usermanagement')  
                }
                else
                {
                    console.log(err);
                }
            })
        }
        else
        {
            console.log(err);
        }
    })
}); 
router.get("/account", authUser, adminAuth, async (req, res) => {
    try {
        var userRole = req.session.role
        var tourCompanies = await getQuery("SELECT * FROM dcove.company")
        var currentUserInfo = await getQuery(`SELECT dcove.users.id as id, u_fname as fname, u_lname as lname, email, role, c_name as company FROM dcove.users, dcove.login, dcove.role, dcove.company WHERE dcove.users.login_id = dcove.login.id AND dcove.login.role_id = dcove.role.id AND dcove.users.u_company = dcove.company.id AND dcove.users.id = ${req.session.uuid};`)
        res.render('adminaccount', {currentUserInfo, tourCompanies, userRole, userRole})
    }
    catch {
    }
})
router.post('/account/update', authUser, adminAuth, function(req, res) {
    
    var sql = `SELECT * FROM dcove.users WHERE id = ${req.body.id}`
    db.query(sql, (err, rows, fields) =>{
        if(!err)
        {
            var loginID = rows[0].login_id;
            var sql2 = `UPDATE dcove.login SET email = "${req.body.email}" WHERE id = "${loginID}"; UPDATE dcove.users SET u_fname = "${req.body.fname}", u_lname = "${req.body.lname}", u_company = "${req.body.tourCompany}" WHERE id = "${req.body.id}"; `    
            db.query(sql2, (err, rows, fields) => {
                if(!err) 
                {
                    res.redirect('/admin/account')
                }
                else
                {
                    console.log(err);
                }
            })
            
        }
        else
        {
            console.log(err);
        }
    })
}); 



router.get('/logout', authUser, (req, res) => {
	req.session.destroy()
	res.redirect('/login')
})

module.exports = router