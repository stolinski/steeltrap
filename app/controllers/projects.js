
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
  .find()
  .populate('_client')
  .exec(function (err, projects) {
    return res.render('projects', {projects:projects});
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
    return res.render('projects/edit'); // html
  });
};


/**
 * Create
 * POST /projects/new
 */

exports.create = function (req, res, next) {
  var project = new Project(req.body);
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
    project.name = req.body.name;
    project.contact = req.body.contact;
    project.email = req.body.email;
    project.status = req.body.status;
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

