const mongoose = require('mongoose')

module.exports = async function() {
    await mongoose.connect(process.env.MONGO_URL, {
        poolSize: process.env.MONGO_POOL,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    
    console.log('Connected to mongodb')
}()