# Modelo Restful com Mongoose simplificado

## Instalação do módulo
```sh
yarn add @wxti/restful
```

## Configurações de variáveis de ambiente (.env)
```
MONGO_URL=mongodb://localhost/database
MONGO_POOL=10
PORT=3000
POST_LIMIT=5mb
```

## Inicialização do módulo (app.js)
```js
// rest core
const app = require('@wxti/restful')

// load models
app.models(`models`)

// load controllers
app.controllers(`controllers`)

// start rest api server
app.start()
```

## Model (models/user.js)
```js
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
```

## Model (models/post.js)
```js
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
```

## Controller (controllers/user.js) - restful customizado
```js
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
```

### Controller (controllers/post.js) - restful puro
```js
/**
 * Ativa modelo restful somente com dados da collection
 * 
 * Chamadas de listagem podem conter parametros
 * skip (numerico)  - salta um determinado numero de registros
 * limit (numerico) - limita um determinado numero de registros 
 * sort (array)     - ordena listagem
 * q (string)       - filtragem
 * fields (array)   - seleção de campos do select
 * 
 * GET      - http://{server}/api/post                                      - lista de posts
 * GET      - http://{server}/api/post?skip=10&limit=10&sort=-name,active   - lista de posts (suporte ordenação e paginação)
 * GET      - http://{server}/api/post?q=title[regex]:teste,active:true     - lista de posts (suporte filtros, regex)
 * GET      - http://{server}/api/post?fields=name,login                    - lista de posts (projection)
 * GET      - http://{server}/api/post/count - não implantado               - contagem de registros (suporta filtros)
 * GET      - http://{server}/api/post/:id                                  - post único (id)
 * GET      - http://{server}/api/post/:id/exists - não implantado          - checa se post existe
 * PUT      - http://{server}/api/post/:id                                  - novo post
 * POST     - http://{server}/api/post                                      - atualizar post
 * DELETE   - http://{server}/api/post/:id                                  - excluir post
 */
module.exports = ({ restful }) => {
    restful.build()
}
```

### Funcionalizaddes futuras
- Integração de comunicação real-time
- Autenticação em chamadas populate e custom - modelo roles