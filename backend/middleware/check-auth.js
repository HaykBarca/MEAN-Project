const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'this_is_a_secret_and_it_should_be_long');
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch {
        res.status(401).json({message: 'You are not authenticated!'});
    }
}