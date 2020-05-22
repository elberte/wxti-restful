const jwt = require('jsonwebtoken')

module.exports = (uri, name) => {
    function inject(app, mongoose) {
        app.post(`${uri}/sign`, async (req, res) => {
            try {
                const model = mongoose.model(name)

                if(!!req.body.login && !!req.body.password) {
                    const user = await model.findOne({ login: req.body.login }).lean()
                    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES })
                    res.json({ status: 'OK', token })
                }
                else {
                    res.json({ status: 'FAIL', message: 'fields login and password required!' })
                }
            }
            catch (err) {
                res.json({ status: 'FAIL', message: err.message })
            }
        })

        app.get(`${uri}/refresh`, async (req, res) => {
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                try {
                    const token = req.headers.authorization.substring(7)
                    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
                    const refresh = jwt.sign({ _id: decoded._id, role: decoded.role }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES})
                    res.json({ status: 'OK', token: refresh })
                }
                catch (err) {
                    res.json({ status: 'FAIL', message: err.message })
                }
            }
            else
            {
                res.json({ status: 'FAIL', message: 'token required!' })
            }
        })
    }

    function authorize(roles = []) {
        if (typeof roles === 'string') {
            roles = [roles]
        }

        return [
            // process JWT
            (req, res, next) => {
                if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                    try {
                        const token = req.headers.authorization.substring(7)
                        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
                        req.auth = decoded
                    }
                    catch { }
                }
    
                next()
            },

            // authorized based on user role
            (req, res, next) => {
                if ((roles.length && !req.auth) || (roles.length && !roles.includes(req.auth.role)))
                    // user's role is not authorized
                    return res.status(401).json({ status: 'FAIL', message: 'Unauthorized' })
    
                // authentication and authorization successful
                next()
            }
        ]
    }

    return {
        inject,
        authorize
    }
}