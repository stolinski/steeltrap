
/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  Schema = mongoose.Schema;


/**
 * Client Schema
 */

var ClientSchema = new Schema({
  name: {type:String, required: true },
  slug: String,
  contact: String,
  email: String,
  active: {type: Boolean, default: true },
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