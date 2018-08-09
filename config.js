'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  MONGODB_URI:
        process.env.DATABASE_URL || 'mongodb://admin:a09fds87@ds113942.mlab.com:13942/spaced-repetition',
  TEST_MONGODB_URI:
        process.env.TEST_DATABASE_URL ||  'mongodb://localhost/spaced-rep-test',
  JWT_SECRET : process.env.JWT_SECRET,
  JWT_EXPIRY : process.env.JWT_EXPIRY || '7d'
};
