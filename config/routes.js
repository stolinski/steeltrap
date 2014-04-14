/**
 * Controllers
 */

var clients = require('../app/controllers/clients'), 
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
};