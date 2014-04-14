
/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  Schema = mongoose.Schema;


/**
 * Client Schema
 */

var ClientSchema = new Schema({
  name: String,
  slug: String,
  contact: String,
  email: String,
  Active: Boolean,
});


/**
 * Pre-validation hook; Sanitizers
 */

ClientSchema.pre('validate', function(next) {
  next();
});

/**
 * Pre-save hook
 */

ClientSchema.pre('save', function(next) {
  this.slug = toSlug(this.name);
  next();
});

mongoose.model('Client', ClientSchema);