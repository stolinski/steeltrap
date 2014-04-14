
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

exports.index = function (req, res, next) {
  Q.ninvoke(Client.index, 'find')
    .then(function (clients) {
      res.locals.clients = clients;
      if (req.url.indexOf('/json') > -1) return res.send(stripMongoIds(clients)); // json
      return res.render('clients'); // html
    })
    .fail(function (err) {
      return next(err); // 500
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
  Q.ninvoke(Client, 'findOne', { slug: req.params.slug })
    .then(function (client) {
      if (!client) return next(); // 404
      res.locals._client = ( req.params.__v && client.changeLog[req.params.__v] ? _.extend(client, client.changeLog[req.params.__v].data) : client );
      if (req.url.indexOf('/json') > -1) return res.send(stripMongoIds(res.locals._client)); // json
      return res.render('clients/show'); // html
    })
    .fail(function (err) {
      return next(err); // 500
    });
};

/**
 * New
 * GET /clients/new
 */

exports.new = function (req, res, next) {
  Q.fcall(function () {
    var clients = req.flash('client');
    return ( clients && clients.length && clients[clients.length-1] ? clients[clients.length-1] : new Client() );
  })
    .then(function (client) {
      res.locals._client = client; // use '_client' because 'client' namespace is occupied, and modifying it will break jade
      return res.render('clients/new', { 
        pageHeading: 'Create Client'
      }); // html
    })
    .fail(function (err) {
      return next(err); // 500
    });
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
  var client = new Client(req.body);
  client.image = Image.create(client.image, req.files.image);

  var _image = [];
  client.image.forEach(function (img) {
    _image.push(Image.promiseImageMeta(img.sysPathRetina));
  });

  Q.all(_image)
    .then(function (metaArray) {
      metaArray.forEach(function (meta, key) {
        client.image[key].meta = Image.filterImageMeta(meta);
      });
      return Q.ninvoke(client, 'save');
    })
    .then(function () {
      req.flash('success', msg.client.created(client.title));
      return res.redirect('/clients'); // html
    })
    .fail(function (err) {
      var vErr = validationErrors(err);
      if (!vErr) return next(err); // 500
      req.flash('error', vErr);
      req.flash('client', client);
      return res.redirect('/clients/new'); // html
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