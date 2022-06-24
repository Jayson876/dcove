const express = require("express");
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const path = require("path");

const server = express();

server.use( express.static( "public" ));
server.use(flash())
server.use(bodyParser.urlencoded({
    extended: true
  }));

server.use(express.urlencoded({ extended: false }))
server.use(express.json())
server.use(
        session({
        secret: 'secret3000',
        resave: false,
        saveUninitialized: true,
        id: null,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        },
    })
)

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, '/views'));

const PORT = 3000;

const indexRouter = require('./routes/pages/index.route');
const loginRouter = require('./routes/pages/login.route');
const bookingRouter = require('./routes/pages/booking.route');
const adminRouter = require('./routes/admin/admin.route');
const tcRouter = require('./routes/tourcomp/tc.route');

server.use("/", indexRouter);
server.use("/login", loginRouter);
server.use("/admin", adminRouter);
server.use("/tc", tcRouter);
server.use("/booknow", bookingRouter);
server.listen(PORT, () => {
	console.log('Server running on port ', PORT)
})