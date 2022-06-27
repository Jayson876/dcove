const router = require("express").Router();
const { getQuery } = require("../../services/getquery")
const dateFormatter = require('../../services/dateFormatter')
const db = require('../../lib/database')
const receipt = require('../../services/receiptnum')

router.get("/", async (req, res) =>{
    try {
        var currentDate = dateFormatter.dateFormatter();
        var currentTime = dateFormatter.timeFormatter();
        var hotels = await getQuery("SELECT * FROM dcove.hotels;")
        var ptype = await getQuery("SELECT * FROM dcove.payment_type;")
        var pstatus = await getQuery("SELECT * FROM dcove.payment_status;")
        var programs = await getQuery("SELECT * FROM dcove.programs;")
        var tourCompanies = await getQuery("SELECT * FROM dcove.company WHERE company_type = 2")
        var shedule = await getQuery("SELECT * FROM dcove.shedule;")
        res.render('bookingpage', {currentDate, currentTime, hotels, ptype,pstatus,programs,tourCompanies,shedule})
    }
    catch {
        console.log(err)
    } 
});

router.post('/booknow/', function(req, res) {
    
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
                                    
                                    res.redirect('/booknow')
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


module.exports = router