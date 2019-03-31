var config = {
    http : {
        listenPort: 8080
    },
    recaptcha: {
        secret: 'yourRecaptchav3SecretKey'
    },
    mongoDatabase: {
        host: 'yourHost',
        port: 'yourPort',
        database: 'yourDatabase',
        user: 'yourUser',
        password: 'yourPassword'
    }
}

module.exports = config;