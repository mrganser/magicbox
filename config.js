var config = {
  http: {
    listenPort: 8080,
  },
  recaptcha: {
    secret: 'yourRecaptchav3SecretKey',
  },
  mongoDatabase: {
    uri: 'mongodbUri',
  },
};

module.exports = config;
