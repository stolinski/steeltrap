/**
 * Routes
 */

var clients = require('../app/controllers/clients'), 
  projects = require('../app/controllers/projects'), 
  expenses = require('../app/controllers/expenses'), 
  home = require('../app/controllers/home');
  events = require('../app/controllers/events');


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
  app.get('/projects', isLoggedIn, projects.index);
  app.get('/projects/json', projects.index);
  app.get('/projects/new', projects.new);
  app.post('/projects/new', projects.create);
  app.get('/projects/new/:slug', projects.new);
  app.get('/projects/:slug', projects.show);
  app.get('/projects/:slug/json', projects.show);
  app.get('/projects/:slug/edit', projects.edit);
  app.post('/projects/todo/edit', projects.todoedit); 
  app.post('/projects/:slug/edit', projects.update);
  app.get('/projects/:id/delete', projects.delete); 
  app.post('/projects/todo', projects.todoadd); 


  // expenses
  app.get('/expenses', expenses.index);
  app.get('/expenses/json', expenses.index);
  app.post('/expenses/new', expenses.create);
  app.post('/expenses/:id/edit', expenses.update);
  app.get('/expenses/:id/delete', expenses.delete);  

  // events
  app.get('/events', events.index);
  // app.get('/events/json', events.index);
  // app.post('/events/new', events.create);
  // app.post('/events/:id/edit', events.update);
  // app.get('/events/:id/delete', events.delete);  


  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') }); 
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  }); 




  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));



  // TWITTER ROUTES
  // route for twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  // GOOGLE ROUTES
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));
 


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

  // locally --------------------------------
    app.get('/connect/local', function(req, res) {
      res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));

  // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
      passport.authorize('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
      }));

  // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
      passport.authorize('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
      }));


  // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
      passport.authorize('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
      }));


    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });



};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');

}