const mongoose = require('mongoose')
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

// environment configuration
require('dotenv').config()

// connect to database
require('./db')

module.exports = function() {
    const app = express()
    const authentication = require('./auth')
    const restful = require('./restful')(app, authentication(app))

    app.use(bodyParser.json({ limit: process.env.POST_LIMIT }))
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.POST_LIMIT }))
    app.use(compression())
    app.use(cors())

    function start() {
        app.listen(process.env.PORT, () => {
            console.log(`Server started at port ${process.env.PORT}`)
        })
    }

    function models(path) {
        fs.readdirSync(path).map(e => {
            console.log(`Loading ${e.replace('.js', '')} model`)
            require(`${process.env.INIT_CWD}/${path}/${e}`)(mongoose)
        })
    }

    function controllers(path, route = '/api') {
        fs.readdirSync(path).map(e => {
            console.log(`Loading ${e.replace('.js', '')} controller`)
            require(`${process.env.INIT_CWD}/${path}/${e}`)({ app, restful: restful(route, e.replace('.js', '')), mongoose })
        })
    }

    function auth(module) {
        module.inject(app, mongoose)
    }

    return {
        start,
        models,
        controllers,
        auth
    }
}()