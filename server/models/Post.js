const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let PostModel = {};

const setVal = (val) => _.escape(val).trim();

// the body of a post: author, contents, and a timestamp for sorting
const PostSchema = new mongoose.Schema({
  contents: {
    type: String,
    required: true,
    trim: true,
    set: setVal,
  },

  author: {
    type: String,
    required: true,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

// we don't use it here but allows us to store this in a format JS understands.
PostSchema.statics.toAPI = (doc) => ({
  contents: doc.name,
  author: doc.author,
});

// sift through our boundless accounts by author
PostSchema.statics.findByAuthor = (username, callback) => {
  const search = {
    author: username,
  };

  return PostModel.find(search).sort({ createdData: -1 }).select('contents author')
    .exec(callback);
};

PostSchema.statics.findByDate = (date, callback) => {
  const search = {
    createdData : {$gt: date - 300000000000, $lt: date},
  };
  
  return PostModel.find(search).sort({ createdData: -1, username: -1 }).select('contents author').exec(callback);
}

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;
