// rest core
const app = require('@wxti/restful')
 
// load models
app.models(`models`)
 
// load controllers
app.controllers(`controllers`)
 
// start rest api server
app.start()