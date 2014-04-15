
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
  Client.find(function(err, clients) {
    res.render('clients', {clients:clients});
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
  Q.ninvoke(Client, 'findOne', { slug: req.params.slug })
    .then(function (client) {
      if (!client) return next(); // 404
      res.locals._client = client;
      return res.render('clients/edit'); // html
    })
    .fail(function (err) {
      return next(err); // 500
    });
};

/**
 * Create
 * POST /clients/new
 */

exports.create = function (req, res, next) {
  console.log(req.body);
  var client = new Client(req.body);
  client.save( function( err) {
    if( !err ) {
      console.log('created');
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
  Q.fcall(Image.update, Client, { slug: req.params.slug }, 'image', req.body.image, req.files.image)
    .then(function (update) {
      return update; // update image
    })
    .then(function (updateData) {
      return Q.ninvoke(Client, 'findOne', { slug: req.params.slug });
    })
    .then(function (client) {
      if (!client) return next(); // 404
      client = _.extend(client, _.omit(req.body, 'image'));
      return Q.ninvoke(client, 'save');
    })
    .then(function () {
      req.flash('success', msg.client.updated(req.body.title));
      return res.redirect('/clients'); // html
    })
    .fail(function (err) {
      var vErr = validationErrors(err);
      if (!vErr) return next(err); // 500 
      req.flash('error', vErr);
      return res.redirect('/clients/' + req.params.slug + '/edit'); // html
    });
};

/**
 * changeLog index
 * GET /clients/:slug/log
 */

exports.log = function (req, res, next) {
  Q.ninvoke(Client.index, 'findOne', { slug: req.params.slug })
    .then(function (client) {
      if (!client) return next(); // 404
      res.locals._client = client;
      return res.render('clients/log'); // html
    })
    .fail(function (err) {
      return next(err); // 500
    });
};

/**
 * changeLog restore
 * GET /clients/:slug/log/:__v/restore
 */
 
exports.restore = function (req, res, next) {
  Q.ninvoke(Client.index, 'findOne', { slug: req.params.slug })
    .then(function (client) {
      if (!client || !client.changeLog[req.params.__v]) return next(); // 404
      var image = client.changeLog[req.params.__v].data.image;
      return Image.restore(Client, { slug: req.params.slug }, 'image', image);
    })
    .then(function () {
      return Q.ninvoke(Client.index, 'findOne', { slug: req.params.slug });
    })
    .then(function (client) {
      if (!client) return next(); // 404
      var data = _.omit(client.changeLog[req.params.__v].data, '__v', 'image');
      data._meta = req.body._meta;
      client = _.extend(client, data);
      res.locals._client = client;
      return Q.ninvoke(client, 'save');
    })
    .then(function () { 
      req.flash('success', msg.client.restored(res.locals._client.title, req.params.__v));
      return res.redirect('/clients'); // html
    })
    .fail(function (err) {
      return next(err); // 500
    });
};