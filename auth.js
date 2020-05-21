const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

module.exports = (uri, name) => {
    function inject(app, mongoose) {
        app.post(`${uri}/sign`, async (req, res) => {
            const model = mongoose.model(name)
            const user = await model.findOne({ login: req.body.login }).lean()
            const token = jwt.sign({ sub: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES })
            res.json({ status: 'OK', token })
        })

        app.post(`${uri}/refresh`, async (req, res) => {
            const model = mongoose.model(name)
            const user = await model.findOne({ login: req.body.login }).lean()
            const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES })
            res.json({ status: 'OK', token })
        })
    }

    function authorize(roles = []) {
        if (typeof roles === 'string') {
            roles = [roles];
        }

        return [
            // authenticate JWT token and attach user to request object (req.user)
            expressJwt({ secret }),

            // authorized based on user role
            (req, res, next) => {
                if (roles.length && !roles.includes(req.user.role)) {
                    // user's role is not authorized
                    return res.status(401).json({ message: 'Unauthorized' });
                }
    
                // authentication and authorization successful
                next();
            }
        ]
    }

    return {
        inject,
        authorize
    }
}