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

        Project
          .find({ status: 'potential' })
          .populate('_client')
          .exec(function (err, pprojects) {
          res.locals.pprojects = pprojects;

          Project
            .find({ status: 'neverwas' })
            .populate('_client')
            .exec(function (err, nprojects) {
            res.locals.nprojects = nprojects;

            Project
              .find()
              .where('paid')
              .gt(0)
              .exec( function(err, allproj) {
              res.locals.allproj = allproj;
              return res.render('projects', {projects:projects});
            });
          });
        });
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
  res.locals.slug = req.params.slug;
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
  Project.findOne({ 'slug': req.params.slug })
    .populate('_client')
    .exec(function (err, project) {
    if (!project) return next();
    res.locals._project = project;
      Client.find({ status: 'active' },function(err, clients) {
        res.locals.clients = clients;
        res.locals.slug = req.params.slug;
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
  project.save(function( err) {
    if( !err ) {
      return res.redirect('/projects');
    } else {
      console.log( err );
    }
  });
};


exports.todoadd = function (req, res, next) {
  console.log(req.body.title);
  Project.findById( req.body.id, function( err, project ) {
    if (!project) return next();
    project.todos.push({ title: req.body.title });
    project.save(function (err) {
      if (!err) console.log('Added Todo');
      return res.send( req.body.title );
    });
  });
};

exports.todoedit = function (req, res, next) {
  Project.findById( req.body.parent, function( err, project ) { 
    var todo = project.todos.id(req.body.id);
    if (todo.complete) {
      todo.complete = false;
    } else {
      todo.complete = true;
    }
    project.save(function (err) {
      if (!err) console.log('Updated Todo');
      return res.send( [todo.complete, req.body.id] );
    });
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
                return res.redirect('/projects');
            } else {
                console.log( err );
            }
        });
    });
};