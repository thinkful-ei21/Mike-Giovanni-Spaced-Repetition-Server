'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CardSchema = mongoose.Schema({
  user_id: {type: String, required: true},
  imageUrls: {type: Array, required: true},
  answer: {type: String, required: true},
  mValue: {type: Number, required: true, default: 1},
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
    _id: this._id,
    imageUrls: this.imageUrls,
    answer: this.answer,
    next: this.next,
    previous: this.previous
  };
};


const Card = mongoose.model('Card', CardSchema);

module.exports = {Card};
