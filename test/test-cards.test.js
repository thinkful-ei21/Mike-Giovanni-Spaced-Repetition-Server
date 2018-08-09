'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../models/user-model');
const { JWT_SECRET, TEST_MONGODB_URI } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Protected endpoint', function () {
  const username = 'exampleUser';
  const password = 'examplePass';

  before(function () {
    return runServer(TEST_MONGODB_URI);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password
      })
    );
  });

  afterEach(function () {
    return User.remove({});
  });

  describe.skip('/api/cards', function () {

    describe('GET', function () {
      it('should return an image url', function(){

        let id;
         User.find({})
         .then(user => {
            id = user[0].id;
            console.log('userID is',user[0])
        })
            ;
        

        const token = jwt.sign(
          {
            id:{id},
            user: {
              username             
              
            },
            exp: Math.floor(Date.now() / 1000) + 1000 // Not expired
          },
          JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: username
          }
        );
            console.log(token)
        return chai
          .request(app)
          .get('/api/cards')
          .set('authorization', `Bearer ${token}`)
          .then(resp =>{console.log(resp.body)})

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
