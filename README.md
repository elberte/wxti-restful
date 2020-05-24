# Modelo Restful com Mongoose simplificado

## Instalação do módulo
```sh
yarn add @wxti/restful
```

## Recursos
- Modelo CRUD simplificado
    - Rotas de listagem com paginação, ordenação, filtros e seleção de campos
    - Rotas de listagem e leitura de registro com populate
    - Rotas customizadas
    
- Autenticação
    - Multiplas camadas de autenticação
    - Autenticação sem envio de senha para backend (em andamento)
    - Segurança do token - vinculo com socket.io ou ip da máquina (em andamento)
    - Atualização de dados pelo dono do registro (em andamento)
    - Troca de senha

## Rotas crud padrão
```
{BASE_API}                          - Rota da API
{ENTITY}                            - Nome da entidade de banco

GET {BASE_API}/{ENTITY}             - Listagem de dados
GET {BASE_API}/{ENTITY}/:id         - Carga de registro
PUT {BASE_API}/{ENTITY}             - Inserção de registro
POST {BASE_API}/{ENTITY}/:id        - Atualização de registro
DELETE {BASE_API}/{ENTITY}          - Exclusão de registro
```

## Parametro de rota de listagem de dados
```
Os parametros são enviados no modelo de URL depois do caracter "?"

skip                                - salta o numero de itens indicados
limit                               - limita o numero de registros retornados
sort                                - ordenação de dados -1 DESC e 1 ASC
q                                   - filtragem segue o modelo do elasticsearch
```

## Configurações de variáveis de ambiente (.env)
```
MONGO_URL=mongodb://localhost/database
MONGO_POOL=10
PORT=3000
POST_LIMIT=5mb
```

## Exemplo de inicialização do módulo (app.js)
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

# Exemplos de uso do módulo
Na pasta samples existem exemplos de uso do módulo

```
- samples/authenticated-api             - exemplo de API com autenticação
- samples/public-api                    - exemplo de API pública
```