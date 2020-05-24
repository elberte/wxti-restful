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