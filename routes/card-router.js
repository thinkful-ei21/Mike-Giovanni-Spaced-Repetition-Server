'use strict';
const express = require('express');
const bodyParser = require('body-parser');


const {Card} = require('../models/card-model');

const router = express.Router();

const jsonParser = bodyParser.json();


// const appendCard = (user_id, previous ='null')=>({
//   user_id: user_id,
//   imageUrls: ['https://i0.wp.com/www.guggenheim.org/wp-content/uploads/2016/04/architecture-pgc-exterior-16-9-ratio-web.jpg'],
//   answer: 'Italy',
//   next: 'null',
//   previous: previous
// });


const popCard =(user_id)=>{

  return Card.findOne({user_id:user_id, previous: 'null'})
    .then(found => {
      return Card.findOneAndRemove({user_id:user_id, previous: 'null'})
        .then(()=>{return found;});
    })
    .catch(err=>{console.log('promise error: ', err);});
};

const insertCard =(card, previous = 'null') => {
  //will insert a card after 'previous', chaning the relevant next and previous properties of adjacent cards
  //leaving previous null will insert at head of list

  card.previous = previous;

  if(card.previous !== 'null'){
    return Card.findOne({_id:card.previous})
      .then(prev =>{
        card.next = prev.next;
        return Card.create(card);    
      })
      .then(newCard =>{
        if(newCard.next !== 'null'){
          return Card.findOneAndUpdate({_id:card.next}, {previous:`${newCard._id}`})
            .then(()=>{
              return Card.findOneAndUpdate({_id:card.previous}, {next:`${newCard._id}`})
                .then(()=>{
                  return newCard;
                });
            });
        }
        else{
          return Card.findOneAndUpdate({_id:card.previous}, {next:`${newCard._id}`})
            .then(()=>{
              return newCard;
            });
        }
      });
  }
  else if (card.previous === 'null'){
    return Card.find({user_id: card.user_id, previous: 'null'})
      .then(found =>{
        if(found.length ===0){
          return Card.create(card);
        }
        else if(found.length >0){
          card.next = found[0]._id;
          return Card.create(card)
            .then((newCard) =>{
              return Card.findOneAndUpdate({_id:found[0]._id}, {previous:`${newCard._id}`})
                .then(()=>{
                  return newCard;
                });
            });
        }

      });
  }

};



router.post('/', jsonParser, (req, res) => {

  //this endpoint currently appends a new card to the end of our logged-in user's linked list.
  //that's probably not what this endpoint will do in the end, 
  //but I have it set up here as an example of how the the logic could work (and to seed lists)


  const _id = req.user._id;

  const exampleCard = {
    user_id: _id,
    imageUrls: ['https://i0.wp.com/www.guggenheim.org/wp-content/uploads/2016/04/architecture-pgc-exterior-16-9-ratio-web.jpg'],
    answer: 'Italy',
  };

  insertCard(exampleCard)
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


  // Card.find({user_id: _id, next: 'null'})
  //   .then(found =>{
  //   //   console.log('found:', found);
  //     return found.length ===0? appendCard(_id) : appendCard(_id, found[0]._id);
  //   })
  //   .then(newCard =>{
  //     return Card.create(newCard);
  //   })
  //   .then(card =>{
  //     if(card.previous !== 'null'){
  //       // console.log('finding prev at:', card.previous);

  //       Card.findOneAndUpdate({_id:card.previous},{next:`${card._id}`})
  //         .then(() =>{
  //           return card;
  //         });

  //     }
  //     return card;
  //   })
  // .then(card => {
  //   return res.status(201).json(card.serialize());
  // })
  // .catch(err => {
  //   // Forward validation errors on to the client, otherwise give a 500
  //   // error because something unexpected has happened
  //   if (err.reason === 'ValidationError') {
  //     return res.status(err.code).json(err);
  //   }
  //   res.status(500).json({code: 500, message: 'Internal server error'});
  // });
    
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
      // console.log(card)
      return res.status(201).json(card.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
    });
});

module.exports = router;