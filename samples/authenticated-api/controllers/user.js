module.exports = ({ restful, mongoose }) => {
    const model = mongoose.model('user')
 
    // rota com populate ativo
    restful.populate({ populate: ['posts'], param: '/with-posts' })
 
    // rota com populate customizado - populate segue modelo do mongoose
    restful.populate({ populate: [{
        path: 'posts',
        select: 'content'
    }], param: '/with-simple-posts' })
 
    // rota customizada
    restful.route('get', '/:id/custom', async (req, res) => {
        try {
            let registers = await model.find({ _id: req.params.id }).populate('posts')
            res.json({ status: 'OK', result: registers })
        }
        catch (err) {
            res.json({ status: 'FAIL', err: err.message })
        }
    })
 
    restful.build({
        remove: ['admin', 'guest'],
        update: ['admin'],
        create: ['admin']
    })
}