const jwt = require('jsonwebtoken')

module.exports = {
    decode: async (headers) => {
        try {
            // grab the authorization header from the request
            const { authorization } = headers
            // grab the token from the authorization header
            const token = authorization.split(' ')[1]
            // decode the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // return the email from the token
            return decoded.email
        } catch (err) {
            console.log(err.message)
        }
    }
}