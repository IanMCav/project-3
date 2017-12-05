const models = require('../models');

const Account = models.Account;

// router call for logging in
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// router call for logging out
const logout = (req, res) => {
  req.session.destroy();
  res.render('login');
};

// server-side login
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Hey, you need to input a username and password' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/profile' });
  });
};

// server-side sign up
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/profile' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// grab the account's profile blurb
const getBlurb = (request, response) => {
  const req = request;
  const res = response;

  if (req.body.searchUsername === '') {
    return Account.AccountModel.findByUsername(req.body.searchUsername, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'an error occurred' });
      }

      console.log(docs);

      return res.json({ blurb: docs });
    });
  }
  return Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occurred' });
    }

    console.log(docs);

    return res.json({ blurb: docs });
  });
};

// would update the account's profile blurb
const setBlurb = () => false;

// get the csrf token.
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.getBlurb = getBlurb;
module.exports.setBlurb = setBlurb;
