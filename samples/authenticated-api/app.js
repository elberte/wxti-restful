// rest core
const app = require('@wxti/restful')
const authentication = require('@wxti/restful/auth')

// authentication routes
const auth = authentication('/auth', 'user')
app.auth(auth)

// load models
app.models(`models`)
 
// load controllers
app.controllers(`controllers`)

// start rest api server
app.start()