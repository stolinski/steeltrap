/**
 * Routes
 */

var clients = require('../app/controllers/clients'), 
  projects = require('../app/controllers/projects'), 
  expenses = require('../app/controllers/expenses'), 
  home = require('../app/controllers/home');


module.exports = function(app, passport) {

  // home
  app.get('/', home.index);

  // clients
  app.get('/clients', clients.index);
  app.get('/clients/json', clients.index);
  app.get('/clients/new', clients.new);
  app.post('/clients/new', clients.create);
  app.get('/clients/:slug', clients.show);
  app.get('/clients/:slug/json', clients.show);
  app.get('/clients/:slug/edit', clients.edit);
  app.post('/clients/:slug/edit', clients.update);
  app.get('/clients/:id/delete', clients.delete);



  // projects
  app.get('/projects', projects.index);
  app.get('/projects/json', projects.index);
  app.get('/projects/new', projects.new);
  app.post('/projects/new', projects.create);
  app.get('/projects/new/:slug', projects.new);
  app.get('/projects/:slug', projects.show);
  app.get('/projects/:slug/json', projects.show);
  app.get('/projects/:slug/edit', projects.edit);
  app.post('/projects/:slug/edit', projects.update);
  app.get('/projects/:id/delete', projects.delete);  


  // expenses
  app.get('/expenses', expenses.index);
  app.get('/expenses/json', expenses.index);
  app.post('/expenses/new', expenses.create);
  app.post('/expenses/:id/edit', expenses.update);
  app.get('/expenses/:id/delete', expenses.delete);  

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') }); 
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');

};

