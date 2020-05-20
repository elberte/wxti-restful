module.exports = (mongoose) => {
    mongoose.model('post', {
        content: {
            type: String,
            required: true
        },
        foto: {
            type: String,
            required: true
        }
    })
}