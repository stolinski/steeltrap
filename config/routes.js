/**
 * Controllers
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

};