
/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  _ = require('underscore');

/**
 * Models
 */

var Client = mongoose.model('Client');
/**
 * Index
 * GET /clients
 * GET /clients/json
 */

exports.index = function (req, res) {
  Client.find({ active: true },function(err, clients) {
    if (req.url.indexOf('/json') > -1) return res.send(clients); // json
    
    Client.find({ active: false }, function (err, iaclients) {
      if (err) return handleError(err);
      res.locals.iaclients = iaclients;
      return res.render('clients', {clients:clients});
    });
    
  });
};

/**
 * Show
 * GET /clients/:slug
 * GET /clients/:slug/json
 * GET /clients/:slug/log/:__v
 * GET /clients/:slug/log/:__v/json
 */

exports.show = function (req, res, next) {
  Client.findOne({ 'slug': req.params.slug }, function (err, client) {
    if (err) return handleError(err);
    return res.render('clients/show', {client:client}); // html
  });
};


/**
 * New
 * GET /clients/new
 */

exports.new = function (req, res, next) {
  var client = new Client();
  res.locals._client = client;
  return res.render('clients/new');
};

/**
 * Edit
 * GET /clients/:slug/edit
 */

exports.edit = function (req, res, next) {
  Client.findOne({ 'slug': req.params.slug }, function (err, client) {
    if (!client) return next();
    res.locals._client = client;
    return res.render('clients/edit'); // html
  });
};


/**
 * Create
 * POST /clients/new
 */

exports.create = function (req, res, next) {
  var client = new Client(req.body);
  client.active = req.body.active == undefined ? false : true;
  client.save( function( err) {
    if( !err ) {
      return res.redirect('/clients');
    } else {
      console.log( err );
    }
  });
};



/**
 * Update
 * POST /clients/:slug/edit
 */

exports.update = function (req, res, next) {
  Client.findOne({ 'slug': req.params.slug }, function (err, client) {
    client.name = req.body.name;
    client.contact = req.body.contact;
    client.email = req.body.email;
    client.active = req.body.active === undefined ? false : true;
    client.save( function( err ) {
      if( !err ) {
        return res.redirect('/clients');
      } else {
        console.log( err );
      }
    }); 
  });
};


exports.delete = function (req, res, next) {
    return Client.findById( req.params.id, function( err, client ) {
        return client.remove( function( err ) {
            if( !err ) {
                console.log( 'Client Removed' );
                return response.send( '' );
            } else {
                console.log( err );
            }
        });
    });
};

