// server.js
var express = require('express'),
  fs = require('fs'),
  engine = require('ejs-locals'),
  mongoose = require( 'mongoose' ), //MongoDB integration
  middleware = require('./app/middleware'),
  bodyParser = require('body-parser'),
  multer = require('multer');
  passport = require('passport'),
  session = require('express-session'),
  flash    = require('connect-flash'),
  cookieParser = require('cookie-parser');


var app = express();

app.use(express.static("public"));

app.use(bodyParser());
app.use(multer({ dest: __dirname + '/public/uploads'}));


//Connect to database
mongoose.connect( 'mongodb://localhost/library_database' );

require('./config/passport')(passport); // pass passport for configuration

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');

app.use(middleware.helpers);
app.locals.moment = require('moment');


// Routes
app.get( '/api', function( request, response ) {
    response.send( 'Library API is running' );
});




// load document models
var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (~file.indexOf('.js')) require(modelsPath + '/' + file);
});

// routes configuration
require('./config/routes')(app, passport);


app.listen(4666);