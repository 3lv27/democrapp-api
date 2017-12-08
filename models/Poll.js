const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const PollSchema = new Schema({
  title: String,
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  properties: {
    options: [String]
  },
  votes: [{
    answer: Number,
    voter: {
      type: ObjectId,
      ref: 'User'
    }
  }],
  voters: {
    type: ObjectId,
    ref: 'User'
  },
  answers: [Number]

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = {Poll};
