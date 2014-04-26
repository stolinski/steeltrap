/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Event Schema
 */

var EventSchema = new Schema({
  title: {type:String, required: true },
  location: String,
  _project: { type: ObjectId, ref: 'Project' },
  _client: { type: ObjectId, ref: 'Client' },
  date: Date,
});

mongoose.model('Event', EventSchema);