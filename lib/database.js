const mysql = require('mysql')

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'new-password',
    database: 'dcove',
    multipleStatements: true
})

db.connect((err) =>{
    if(!err)
    {
        console.log("Connected")
    }
    else
    {
        console.log("Connection Failed")
    }
})

module.exports = db