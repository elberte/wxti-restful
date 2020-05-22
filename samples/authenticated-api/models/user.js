module.exports = (mongoose) => {
    mongoose.model('user', {
        login: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
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