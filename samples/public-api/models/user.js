module.exports = (mongoose) => {
    mongoose.model('user', {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        posts: {
            type: mongoose.Types.ObjectId,
            ref: 'post'
        }
    })
}