const controllers = require('./controllers');
const mid = require('./middleware');

// tell the app where to go when gets a request type and a specific url
const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/profile', mid.requiresLogin, controllers.Post.userPage);
  app.post('/new', mid.requiresLogin, controllers.Post.new);
  app.get('/blurb', mid.requiresLogin, controllers.Account.getBlurb);
  app.post('/blurb', mid.requiresLogin, controllers.Account.setBlurb);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
