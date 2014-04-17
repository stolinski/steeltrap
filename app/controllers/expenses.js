
/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  _ = require('underscore');

/**
 * Models
 */

var Expense = mongoose.model('Expense'),
  Project = mongoose.model('Project'),
  Client = mongoose.model('Client');
/**
 * Index
 * GET /expenses
 * GET /expenses/json
 */

exports.index = function (req, res) {
  var expense = new Expense();
  res.locals._expense = expense;
  Expense.find().sort({date: 'desc'}).populate('_project').exec(function (err, expenses) {
    Project.find( function (err, projects) {
      Client.find( function (err, clients) {
        res.locals.clients = clients;
        res.locals.projects = projects;
        res.locals.expenses = expenses;
        return res.render('expenses');
      });
    });
  });
};


/**
 * Create
 * POST /expenses/new
 */

exports.create = function (req, res, next) {
  var expense = new Expense();
  expense.title = req.body.title;
  expense.date = req.body.date;
  expense.cost = req.body.cost;
  expense._client = req.body._client == "none" ? null : req.body._client; 
  expense._project = req.body._project == "none" ? null : req.body._project; 
  expense.save( function( err) {
    if( !err ) {
      return res.redirect('/expenses');
    } else {
      console.log( err );
    }
  });
};



/**
 * Update
 * POST /expenses/:slug/edit
 */

exports.update = function (req, res, next) {
  Expense.findOne({ 'slug': req.params.slug }, function (err, expense) {
    expense.name = req.body.name;
    expense.contact = req.body.contact;
    expense.email = req.body.email;
    expense.status = req.body.status;
    expense.save( function( err ) {
      if( !err ) {
        return res.redirect('/expenses');
      } else {
        console.log( err );
      }
    }); 
  });
};


exports.delete = function (req, res, next) {
    return Expense.findById( req.params.id, function( err, expense ) {
        return expense.remove( function( err ) {
            if( !err ) {
                console.log( 'Expense Removed' );
                return response.send( '' );
            } else {
                console.log( err );
            }
        });
    });
};

