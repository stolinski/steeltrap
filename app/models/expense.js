/**
 * Module dependencies
 */

var mongoose = require('mongoose'), 
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Expense Schema
 */

var ExpenseSchema = new Schema({
  title: {type:String, required: true },
  cost: Number,
  _project: { type: ObjectId, ref: 'Project' },
  _client: { type: ObjectId, ref: 'Client' },
  date: Date,
});

mongoose.model('Expense', ExpenseSchema);