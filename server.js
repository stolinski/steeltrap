// server.js
var express = require('express'),
  fs = require('fs'),
  engine = require('ejs-locals'),
  mongoose = require( 'mongoose' ), //MongoDB integration
  middleware = require('./app/middleware'),
  bodyParser = require('body-parser');

var app = express();


app.use(express.static("public"));
app.use(bodyParser());

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');

app.use(middleware.helpers);


// Routes
app.get( '/api', function( request, response ) {
    response.send( 'Library API is running' );
});





//Connect to database
mongoose.connect( 'mongodb://localhost/library_database' );

// load document models
var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (~file.indexOf('.js')) require(modelsPath + '/' + file);
});

// routes configuration
require('./config/routes')(app);



app.listen(4666);