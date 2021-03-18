
const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Not Authorized.');
    res.redirect('/users/signin');
};

module.exports = helpers;