'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {cardArr} = require('../db/cardDB');
const {Card} = require('../models/card-model');
const {popCard, insertAfter, insertAt, populateCards} = require('../db/utils');

const router = express.Router();

const jsonParser = bodyParser.json();



router.post('/', jsonParser, (req, res) => {

  //post endpoint is depreciated, I think.... leaving it in for now in case it helps with testing

  //this endpoint currently appends a new card to the end of our logged-in user's linked list.
  //that's probably not what this endpoint will do in the end, 
  //but I have it set up here as an example of how the the logic could work (and to seed lists)


  const _id = req.user._id;

  let i = 0;
      
  
  const findNext = (prevID = 'null') => {
    
    Card.findOne({user_id: _id, previous: prevID})
      .then(found=>{
        // console.log('found next:',found)
        console.log(i, found.answer);
        i++;
        if(found.next !== 'null'){          
          findNext(found._id);
        }     
      });
  };
  findNext();

  return res.status(201).json('check the server logs');
  
  // let cardTemplate = cardArr[Math.floor(Math.random()*(cardArr.length))];
  // cardTemplate.user_id = _id;
  // // console.log(cardTemplate);

  // insertAfter(cardTemplate)
  //   .then(card => {
  //     return res.status(201).json(card.serialize());
  //   })
  //   .catch(err => {
  //   // Forward validation errors on to the client, otherwise give a 500
  //   // error because something unexpected has happened
  //     if (err.reason === 'ValidationError') {
  //       return res.status(err.code).json(err);
  //     }
  //     res.status(500).json({code: 500, message: 'Internal server error'});
  //   });


});

router.put('/', jsonParser, (req, res) =>{

  const _id = req.user._id;
  const answer = req.body.answer.toLowerCase();
  let correctAnswer = '';
  let result = false;
  let mValue;

  // gets answer from client, compares with first element of user's linked list
  // will update linked list with new values
  // responds with resultAnswer, result (true/false)
  Card.findOne({user_id: _id, previous: 'null'})
    .then(card => {
      correctAnswer = card.answer;
      if(!card) {
        const DBError = new Error ('Database Error');
        return Promise.reject(DBError);
      } else {
        if(card.answer.toLowerCase() === answer) {
          console.log('answers ', answer, card.answer);
          result = true;
          mValue = card.mValue * 2;
        } else {
          result = false;
          mValue = 1;
        }
        return card._id;
      }
    })
    .then(() => {
      let card = popCard(_id);
      return card.then(card => {
        card.mValue = mValue;
        // console.log('value', card)
        return insertAt(card, mValue);
      });
    })
    .then(() => {
      res.status(201).json({correctAnswer, result});
    });
});


router.get('/', jsonParser, (req, res) => {
// look at card database and only returns first item in LL thats associated with user 
  const _id = req.user._id;

  Card.find({user_id: _id, previous: 'null'})
    .then(cards => {
      if(cards.length > 0){
        return cards[0];
      }
      else{
        return populateCards(_id)
          .then((result)=>{
            // console.log(result);
            return Card.findOne({user_id: _id, previous: 'null'});
          });
      }
    })
    .then(card => {
      // console.log(card)
      const image = card.imageUrls[Math.floor(Math.random()*(card.imageUrls.length))];
      return res.status(201).json(image);
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      else res.status(400).json(err);
    });
});

module.exports = router;