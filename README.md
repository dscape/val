This is apache 2.0. Fork it. If you do a good job at it I will use your thing instead of mine.

![INSERT MEME](http://memecrunch.com/meme/8WW2/stupid-internet-kids-get-off-my-internet-lawn/image.png)

[![build status](https://secure.travis-ci.org/dscape/val.png)](http://travis-ci.org/dscape/val)

How it works if you have something in production or something:

``` js
module.exports = function routes(app) {
  app.get('/', function (req, res) {
    res.render('index');
  });

  app.post('/create-an-account', [require('./validate/account')], function (req, res) {
    res.render('account_created');
  });

};
```

Validation code looks something like this:

``` js
var val = require('val')();

module.exports = val.validate([{
  required: 'email'
  }, {
  required: 'password'
  }], function on_error(err, req, res, next) {
  res.render('account_created', {
    flash: err.message
  });
});
```

TOTAL WATEVS