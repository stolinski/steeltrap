
/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  _ = require('underscore');

/**
 * Models
 */

var Project = mongoose.model('Project');
var Client = mongoose.model('Client');
/**
 * Index
 * GET /projects
 * GET /projects/json
 */

exports.index = function (req, res) {
  Project
  .find({ status: 'active', _user: req.user })
  .populate('_client')
  .exec(function (err, projects) {
    Project
      .find({ status: 'inactive' })
      .populate('_client')
      .exec(function (err, iaprojects) {
        res.locals.iaprojects = iaprojects;
        return res.render('projects', {projects:projects});
    });  
  });
};

/**
 * Show
 * GET /projects/:slug
 * GET /projects/:slug/json
 * GET /projects/:slug/log/:__v
 * GET /projects/:slug/log/:__v/json
 */

exports.show = function (req, res, next) {
  Project.findOne({ 'slug': req.params.slug }, function (err, project) {
    if (err) return handleError(err);
    return res.render('projects/show', {project:project}); // html
  });
};


/**
 * New
 * GET /projects/new
 */

exports.new = function (req, res, next) {
  var project = new Project();
  res.locals._project = project;
  Client.find({ status: 'active' },function(err, clients) {
    res.locals.clients = clients;
    return res.render('projects/new');
  });

};

/**
 * Edit
 * GET /projects/:slug/edit
 */

exports.edit = function (req, res, next) {
  Project.findOne({ 'slug': req.params.slug }, function (err, project) {
    if (!project) return next();
    res.locals._project = project;
      Client.find({ status: 'active' },function(err, clients) {
        res.locals.clients = clients;
        return res.render('projects/edit'); // html
      });
  });
};


/**
 * Create
 * POST /projects/new
 */

exports.create = function (req, res, next) {
  var project = new Project();
  project.title = req.body.title;
  project.cost = req.body.cost;
  project.paid = req.body.paid;
  project.status = req.body.status;
  project.paiddate = req.body.paiddate;
  project.invdate = req.body.invdate;
  project.invoiced= req.body.invoiced? "true" : "false";
  project.desc = req.body.desc;
  project._user = req.user;
  project._client = req.body._client == "none" ? null : req.body._client; 
  project._project = req.body._project == "none" ? null : req.body._project; 
  project.save( function( err) {
    if( !err ) {
      return res.redirect('/projects');
    } else {
      console.log( err );
    }
  });
};



/**
 * Update
 * POST /projects/:slug/edit
 */

exports.update = function (req, res, next) {
  Project.findOne({ 'slug': req.params.slug }, function (err, project) {
    project.title = req.body.title;
    project.cost = req.body.cost;
    project.paid = req.body.paid;
    project.status = req.body.status;
    project.paiddate = req.body.paiddate;
    project.invdate = req.body.invdate;
    project.invoiced= req.body.invoiced? "true" : "false";
    project.desc = req.body.desc;
    project._client = req.body._client == "none" ? null : req.body._client; 
    project._project = req.body._project == "none" ? null : req.body._project; 
    project.save( function( err ) {
      if( !err ) {
        return res.redirect('/projects');
      } else {
        console.log( err );
      }
    }); 
  });
};


exports.delete = function (req, res, next) {
    return Project.findById( req.params.id, function( err, project ) {
        return project.remove( function( err ) {
            if( !err ) {
                console.log( 'Project Removed' );
                return response.send( '' );
            } else {
                console.log( err );
            }
        });
    });
};

