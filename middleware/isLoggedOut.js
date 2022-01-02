module.exports = (req, res, next) => {
  // if a logged in user tries to access auth pages, they are redirected to private pages
  if (req.user) {
    return res.redirect('/user/dashboard');
  }
  next();
};
