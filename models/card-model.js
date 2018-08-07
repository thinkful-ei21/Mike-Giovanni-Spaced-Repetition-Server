'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CardSchema = mongoose.Schema({
  user_id: {type: String, required: true},
  imageUrls: {type: Array, required: true},
  answer: {type: String, required: true},
  next: {type: String, default: 'null'},
  previous: {type: String, default: 'null'}
});

//next and previous are mutable. need methods to change them and to get them... though we could just get the obj


CardSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

CardSchema.methods.serialize = function() {
  return {
    user_id: this.user_id,
    _id: this._id
  };
};


const Card = mongoose.model('Card', CardSchema);

module.exports = {Card};
