'use strict';
const express = require('express');
const bodyParser = require('body-parser');


const {Card} = require('../models/card-model');

const router = express.Router();

const jsonParser = bodyParser.json();


const appendCard = (user_id, previous ='null')=>({
  user_id: user_id,
  imageUrls: ['place.holder'],
  answer: 'test answer',
  next: 'null',
  previous: previous
});

router.post('/', jsonParser, (req, res) => {

  //this endpoint currently appends a new card to the end of our logged-in user's linked list.
  //that's probably not what this endpoint will do in the end, 
  //but I have it set up here as an example of how the the logic could work (and to seed lists)


  const _id = req.user._id;

  Card.find({user_id: _id, next: 'null'})
    .then(found =>{
    //   console.log('found:', found);
      return found.length ===0? appendCard(_id) : appendCard(_id, found[0]._id);
    })
    .then(newCard =>{
      return Card.create(newCard);
    })
    .then(card =>{
      if(card.previous !== 'null'){
        console.log('finding prev at:', card.previous);

        Card.findOneAndUpdate({_id:card.previous},{next:`${card._id}`})
          .then((updated) =>{
            return card;
          });

      }
      return card;
    })
    .then(card => {
      return res.status(201).json(card.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
    
});

router.get('/', jsonParser, (req, res) => {
// look at card database and only returns first item in LL thats associated with user 
  const _id = req.user._id;

  Card.findOne({user_id: _id, previous: 'null'})
    .then(card => {
      // console.log(card);
      return card;
    })
    .then(card => {
      console.log(card)
      return res.status(201).json(card.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
    });
});

module.exports = router;