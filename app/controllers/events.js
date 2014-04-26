
/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  _ = require('underscore');

/**
 * Models
 */

var Event = mongoose.model('Event'),
  Project = mongoose.model('Project'),
  Client = mongoose.model('Client');
/**
 * Index
 * GET /events
 * GET /events/json
 */

exports.index = function (req, res) {
  var event = new Event();
  res.locals._event = event;
  Event.find().sort({date: 'desc'}).populate('_project').exec(function (err, events) {
    Project.find( function (err, projects) {
      Client.find( function (err, clients) {
        res.locals.clients = clients;
        res.locals.projects = projects;
        res.locals.events = events;
        return res.render('events');
      });
    });
  });
};


