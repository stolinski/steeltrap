
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , _ = require('underscore');


/**
   * Returns a URL-safe value from another value
   *
   * @param {String} value
   * @returns {String} URL-safe value
   */

exports.helpers = function (req, res, next) {

  toSlug = function (value) {
    return value.toLowerCase().replace(/[ |_]/g, '-').replace(/[^\w-]+/g,'');
  };


  next();
};