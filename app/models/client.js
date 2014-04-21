
/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  Schema = mongoose.Schema,
  crate = require("mongoose-crate"),
  ImageMagick = require("mongoose-crate-imagemagick"),
  S3 = require("mongoose-crate-s3"),
  gravatar = require('gravatar');

/**
 * Client Schema
 */
var configAuth = require('../../config/auth');


var ClientSchema = new Schema({
  name: {type:String, required: true },
  slug: String,
  contact: String,
  email: String,
  status: String,
  grav: String,
});

 
ClientSchema.plugin(crate, {
  storage: new S3({
    key: "configAuth.amazonAuth.key",
    secret: "configAuth.amazonAuth.secret",
    bucket: "steeltrapp"
  }),
  fields: {
    image: {
      processor: new ImageMagick({
        tmpDir: "/tmp", // Where transformed files are placed before storage, defaults to os.tmpdir()
        formats: ["JPEG", "GIF", "PNG"], // Supported formats, defaults to ["JPEG", "GIF", "PNG", "TIFF"]
        transforms: {
          original: {
            // keep the original file
          },
          small: {
            resize: "150x150",
            format: ".jpg"
          },
          medium: {
            resize: "300",
            crop: "300x187+30+15",
            format: ".jpg"
          }
        }
      })      
    }
  }
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
  this.grav = gravatar.url(this.email, {s: '200', r: 'pg', d: 'mm'});
  next();
});

mongoose.model('Client', ClientSchema);