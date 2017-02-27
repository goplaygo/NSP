module.exports = {
    port: 3000,
    session: {
        secret: 'Share',
        key: 'Share',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/Share'
};