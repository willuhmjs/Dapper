require('dotenv').config()

module.exports = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENTID,
    mongo: process.env.MONGO
}