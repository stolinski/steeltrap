
/**
 * Module dependencies
 */

var fs = require('fs'), 
  mongoose = require('mongoose');

/**
 * Models
 */

var Client = mongoose.model('Client');


/**
 * Index
 * GET /
 */

exports.index = function (req, res, next) {
  console.log("on home bitches");
  return res.render('home');
};