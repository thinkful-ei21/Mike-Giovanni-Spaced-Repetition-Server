'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../models/user-model');
const { Card } = require('../models/card-model');
const { JWT_SECRET, TEST_MONGODB_URI } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Protected endpoint', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  let Uid;

  before(function () {
    return runServer(TEST_MONGODB_URI);
      
  });

  after(function () {
    return   closeServer();
  });


  beforeEach(function () {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password
      })
        .then(res => {
          Uid = res.id;
        })
      
    );
    
  });

  afterEach(function () {
    return User.remove({})
      .then(Card.remove({}));
    
  });

  describe('/api/cards', function () {

    describe('GET', function () {
      it('should return an image url', function(){

        const username = 'exampleUser';
        const password = 'examplePass';

        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password
          })
          .then(()=>{
            return  chai
              .request(app)
              .post('/api/auth/login')
              .send({
                username,
                password
              });
          })
          .then(res =>{
            return res.body.authToken;
          })
          .then(token =>{
            return chai
              .request(app)
              .get('/api/cards')
              .set('authorization', `Bearer ${token}`);
                
          })
          .then(res =>{
            expect(res).to.have.status(201);
            expect(res.body).to.be.a('string');           
          });

      });


    });       

    describe('PUT', function () {
      it('should return correct answer and a boolian (true) if correct answer submitted', function(){
        //note, all these tests assume 'Japan' is the first card. could make database calls if we want to make this more adaptable
  
        const username = 'exampleUser';
        const password = 'examplePass';
        const id = '5b46627a18a98b79c2fac223';
        let token;
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password
          })
          .then(()=>{
            return  chai
              .request(app)
              .post('/api/auth/login')
              .send({
                username,
                password
              });
          })
          .then(res =>{
            return res.body.authToken;
          })
          .then(resp =>{
            token = resp;

            return chai
              .request(app)
              .get('/api/cards')
              .set('authorization', `Bearer ${token}`);
                
          })
          .then(()=>{
            return chai
              .request(app)
                
              .put('/api/cards')
              .send({answer: 'Japan'})
                
              .set('authorization', `Bearer ${token}`);
          })
          .then(res =>{
            expect(res.body.correctAnswer).to.equal('Japan');
            expect(res.body.result).to.equal(true);
          });

      });
    });

    it('should return correct answer and a boolian (false) if incorrect answer submitted', function(){
  
      const username = 'exampleUser';
      const password = 'examplePass';
      const id = '5b46627a18a98b79c2fac223';
      let token;
      return chai
        .request(app)
        .post('/api/users')
        .send({
          username,
          password
        })
        .then(()=>{
          return  chai
            .request(app)
            .post('/api/auth/login')
            .send({
              username,
              password
            });
        })
        .then(res =>{
          return res.body.authToken;
        })
        .then(resp =>{
          token = resp;

          return chai
            .request(app)
            .get('/api/cards')
            .set('authorization', `Bearer ${token}`);
                
        })
        .then(()=>{
          return chai
            .request(app)
                
            .put('/api/cards')
            .send({answer: 'not_Japan'})
                
            .set('authorization', `Bearer ${token}`);
        })
        .then(res =>{
          expect(res.body.correctAnswer).to.equal('Japan');
          expect(res.body.result).to.equal(false);
        });

    });
    

    it('should displace the top card by one spot if incorrect answer submitted, and two spots for a correct answer', function(){
  
      const username = 'exampleUser';
      const password = 'examplePass';
      let uId;
      let token;
      return chai
        .request(app)
        .post('/api/users')
        .send({
          username,
          password
        })
        .then((res)=>{

          
          return  chai
            .request(app)
            .post('/api/auth/login')
            .send({
              username,
              password
            });
        })
        .then(res =>{
          return res.body.authToken;
        })
        .then(resp =>{
          token = resp;

          return chai
            .request(app)
            .get('/api/cards')
            .set('authorization', `Bearer ${token}`);
                
        })
        .then(()=>{
          return chai
            .request(app)
            .put('/api/cards')
            .send({answer: 'not_Japan'})
            .set('authorization', `Bearer ${token}`);
        })
        .then((res)=>{
        //   console.log(res.body.correctAnswer); 
          expect(res.body.result).to.equal(false);

          return chai
            .request(app)
            .put('/api/cards')
            .send({answer: 'Australia'})
            .set('authorization', `Bearer ${token}`);
        })
        // .then(res => {
        //   return Card.find({user_id: Uid})
        //     .then(cdb =>{
        //       console.log(cdb.length);
        //       return res;
        //     });
        // })
        .then((res)=>{

        //   console.log(res.body.correctAnswer); 
          expect(res.body.result).to.equal(true); 

          return chai
            .request(app)
            .put('/api/cards')
            .send({answer: 'Japan'})
            .set('authorization', `Bearer ${token}`);
        })
        .then((res)=>{
        //   console.log(res.body.correctAnswer); 
          expect(res.body.result).to.equal(true);
 
            
          return chai
            .request(app)
            .put('/api/cards')
            .send({answer: 'Australia'})
            .set('authorization', `Bearer ${token}`);
        })
        .then((res)=>{
        //   console.log(res.body.correctAnswer); 
          expect(res.body.result).to.equal(false); 
            
          return chai
            .request(app)
            .put('/api/cards')
            .send({answer: 'Australia'})
            .set('authorization', `Bearer ${token}`);
        })
        .then(res =>{
        //   console.log(res.body.correctAnswer); 
          expect(res.body.result).to.equal(true);
        });



    });











  });
//   describe('/api/protected', function () {
//     it('Should reject requests with no credentials', function () {
//       return chai
//         .request(app)
//         .get('/api/protected')
//         .catch(err => {
//           if (err instanceof chai.AssertionError) {
//             throw err;
//           }

//           const res = err.response;
//           expect(res).to.have.status(401);
//         });
//     });

//     it('Should reject requests with an invalid token', function () {
//       const token = jwt.sign(
//         {
//           username
//         },
//         'wrongSecret',
//         {
//           algorithm: 'HS256',
//           expiresIn: '7d'
//         }
//       );

//       return chai
//         .request(app)
//         .get('/api/protected')
//         .set('Authorization', `Bearer ${token}`)
//         .catch(err => {
//           if (err instanceof chai.AssertionError) {
//             throw err;
//           }

//           const res = err.response;
//           expect(res).to.have.status(401);
//         });
//     });
//     it('Should reject requests with an expired token', function () {
//       const token = jwt.sign(
//         {
//           user: {
//             username
//           },
//           exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
//         },
//         JWT_SECRET,
//         {
//           algorithm: 'HS256',
//           subject: username
//         }
//       );

//       return chai
//         .request(app)
//         .get('/api/protected')
//         .set('authorization', `Bearer ${token}`)
//         .catch(err => {
//           if (err instanceof chai.AssertionError) {
//             throw err;
//           }

//           const res = err.response;
//           expect(res).to.have.status(401);
//         });
//     });
//   });
});
