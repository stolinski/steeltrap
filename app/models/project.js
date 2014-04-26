/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Project Schema
 */

var ProjectSchema = new Schema({
  title: {type:String, required: true },
  slug: String,
  cost: Number,
  paid: Number,
  invoiced: Boolean,
  status: String,
  desc: String,
  _client: { type: ObjectId, ref: 'Client' },
  _user: { type: ObjectId, ref: 'User' },
  owed: Number,
  paiddate: Date,
  invdate: Date,
});


/**
 * Pre-validation hook; Sanitizers
 */

ProjectSchema.pre('validate', function(next) {
  next();
});

/**
 * Pre-save hook
 */

ProjectSchema.pre('save', function(next, req, callback) {
  this._user = req.user;
  this.slug = toSlug(this.title);
  this.owed = this.cost - this.paid;
  next();
});

mongoose.model('Project', ProjectSchema);