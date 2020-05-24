/**
 * Ativa modelo restful com dados da collection adicionando rotas customizadas
 * 
 * Rotas padrão
 * GET      - http://{server}/api/user?skip=10&limit=10&sort=-name,active   - lista de usuários (suporta filtros, ordenação e paginação)
 * GET      - http://{server}/api/user/:id                                  - único usuário (id)
 * GET      - http://{server}/api/user/count                                - contagem de registros (suporta filtros)
 * PUT      - http://{server}/api/user/:id                                  - novo usuário
 * POST     - http://{server}/api/user                                      - atualizar usuário
 * DELETE   - http://{server}/api/user/:id                                  - excluir usuário
 * 
 * Rotas customizadas
 * GET      - http://{server}/api/user/with-posts                           - rota montada pelo metodo populate
 * GET      - http://{server}/api/user/:id/with-posts                       - rota montada pelo metodo populate
 * GET      - http://{server}/api/user/with-simple-posts                    - rota montada pelo metodo populate
 * GET      - http://{server}/api/user/:id/with-simple-posts                - rota montada pelo metodo populate
 * GET      - http://{server}/api/user/:id/custom                           - rota montada pelo metodo route
 */
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
 
    restful.build()
}