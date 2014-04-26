
/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  _ = require('underscore'),
  crate = require("mongoose-crate"),
  ImageMagick = require("mongoose-crate-imagemagick"),
  S3 = require("mongoose-crate-s3");
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
  Client.find({ status: 'active' },function(err, clients) {
    if (req.url.indexOf('/json') > -1) return res.send(clients); // json
    Client.find({ status: 'inactive' }, function (err, iaclients) {
      Client.find({ status: 'potential' }, function (err, potential) {
        Client.find({ status: 'neverwas' }, function (err, neverwas) {
          res.locals.clients = clients;
          res.locals.iaclients = iaclients;
          res.locals.potential = potential;
          res.locals.neverwas = neverwas;
          return res.render('clients');
        });
      });
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
  client._user = req.user;
  client.attach('image', req.files.image, function(err) {
    if(err) return next(err);
    client.save(function(err) {
      console.log( 'made it past save' );
      if( !err ) {
        console.log( 'made it no error' );
        return res.redirect('/clients');
      } else {
        console.log( 'error' );
        console.log( err );
      }
    });
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
    client.status = req.body.status;
    client._user = req.user;
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
                console.log( 'Client Removed!' );
                return res.redirect('/clients');
            } else {
                console.log( err );
            }
        });
    });
};

