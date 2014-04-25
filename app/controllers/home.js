
/**
 * Module dependencies
 */

var fs = require('fs'), 
  mongoose = require('mongoose');

/**
 * Models
 */

var Client = mongoose.model('Client'),
    Project = mongoose.model('Project');

/**
 * Index
 * GET /
 */

exports.index = function (req, res, next) {
  Project
    .find({ status: 'active', _user: req.user })
    .populate('_client')
    .exec(function (err, projects) {
      return res.render('home',{ message: req.flash('loginMessage') });
    });
};