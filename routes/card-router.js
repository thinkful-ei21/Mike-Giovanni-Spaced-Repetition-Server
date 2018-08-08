'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {cardArr} = require('../cardDB.js');
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
  //removes and returns first document in ll

  return Card.findOne({user_id:user_id, previous: 'null'})
    .then(found => {
      return Card.findOneAndRemove({user_id:user_id, previous: 'null'})
        .then(()=>{return found;});
    })
    .catch(err=>{console.log('promise error: ', err);});
};



const insertAfter =(card, previous = 'null') => {
  //will insert a card after 'previous', chaning the relevant next and previous properties of adjacent cards
  //leaving previous null will insert at head of list

  card.previous = previous;
  return new Promise((resolve) => {
    if(card.previous !== 'null'){
      return Card.findOne({_id:card.previous})
        .then(prev =>{
          card.next = prev.next;
          resolve(Card.create(card));    
        })
        .then(newCard =>{
          if(newCard.next !== 'null'){
            return Card.findOneAndUpdate({_id:card.next}, {previous:`${newCard._id}`})
              .then(()=>{
                return Card.findOneAndUpdate({_id:card.previous}, {next:`${newCard._id}`})
                  .then(()=>{
                    resolve(newCard);
                  });
              });
          }
          else{
            return Card.findOneAndUpdate({_id:card.previous}, {next:`${newCard._id}`})
              .then(()=>{
                resolve(newCard);
              });
          }
        });
    }
    else if (card.previous === 'null'){
      console.log(card);
      //if we want to insert at the head of our ll, we will insert -before- our first element
      return Card.find({user_id: card.user_id, previous: 'null'})
        .then(found =>{
          console.log(found);
          if(found.length === 0){
            resolve(Card.create(card));
          }
          else if(found.length >0){
            console.log('inserting first');
            card.next = found[0]._id;
            return Card.create(card)
              //create card has to happen after we find our first element(to get it's _id),
              // but before we update that element's previous (because we need to create in order to have a new _id)
              .then((newCard) =>{
                return Card.findOneAndUpdate({_id:found[0]._id}, {previous:`${newCard._id}`})
                  .then(()=>{
                    //but we don't actually care about what our update returns, we want to return our new card
                    resolve(newCard);
                  });
              });
          }

        });
    }
  });
};

const insertAt =(card, index) => {
  //loop thorough our ll ( a while loop, prob.) to find the card before our index, then call insertAfter()

  let i = 0;
  let currCard = 'null';
  let brk = false;

  while(i < index && !brk){

    Card.findOne({user_id: card.user_id, previous: currCard})
      .then(cc =>{
        currCard = cc;
        if(cc.next !== 'null'){
          i++;
        }
        else{
          brk = true;
        }
      });
  }

  return insertAfter(card, currCard);
};


const populateCards = (_id) =>{

  let index = 0;
  console.log('here?')
  async function iterate (cardArr, index) {
    
    if(index === cardArr.length){
      return new Promise((resolve)=>{
        resolve()
      })

    }

    console.log('here again')
    if(index === cardArr.length){
      return;
    }
    const cardTemplate = cardArr[index];
    cardTemplate.user_id = _id;

    let done = await insertAfter(cardTemplate)
    return (iterate(cardArr, index +1));
  }

  return iterate(cardArr, index);

  // };
  // console.log('here')

  // for (let index = 0; index < cardArr.length;) {
  //   const cardTemplate = cardArr[index];
  //   cardTemplate.user_id = _id;
  //   insertAfter(cardTemplate)
  //     .then(card =>{
  //       console.log(card);
  //       index++;});
    
  // }

  // for (let cardTemplate of cardArr){
  //   cardTemplate.user_id = _id;

  //   let obj = insertAfter(cardTemplate)





  // return;

};


router.post('/', jsonParser, (req, res) => {

  //this endpoint currently appends a new card to the end of our logged-in user's linked list.
  //that's probably not what this endpoint will do in the end, 
  //but I have it set up here as an example of how the the logic could work (and to seed lists)


  const _id = req.user._id;


  let cardTemplate = cardArr[Math.floor(Math.random()*(cardArr.length))];
  cardTemplate.user_id = _id;
  console.log(cardTemplate);

  insertAfter(cardTemplate)
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

  Card.find({user_id: _id, previous: 'null'})
    .then(cards => {
      if(cards.length > 0){
        return cards[0];
      }
      else{
        return populateCards(_id)
          .then(()=>Card.findOne({user_id: _id, previous: 'null'}));
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
    });
});

module.exports = router;