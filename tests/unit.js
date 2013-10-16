var Val = require('../lib/val')({
  params: 'params'
});

var test = require("tap").test;

test("validate an email that is required and actually is a good email", function (t) {
  var val = Val.validate([{
    required: 'email'
  }], function on_error(err) {
    console.log('how did i get here? im drunk');
    t.ok(false);
  });

  val({
    params: {
      email: 'foo@nar.ly'
    }
  }, null, function () {
    //
    // next is not called in error, so if it got here everything is awsm
    //
    t.ok(true, 'no errors in a valid request');
    t.end();
  });
});

test("validation error that doesnt call next should not run next", function (t) {
  t.plan(1);

  var val = Val.validate([{
    required: 'email'
  }], function on_error(err, req, res, next) {
    //
    // set timeout so that plan doesnt exit prematurely
    //
    // kind of sucks, but should just work
    //
    setTimeout(function () {
      t.ok(err, 'we should have an error');
    }, 100);
    //
    // not calling next
    //
  });

  val({}, null, function () {
    t.ok(false, 'this should never happen cause we didnt call next');
  });
});

test("there are no params in the request", function (t) {
  var errored_out = false;

  var val = Val.validate([{
    required: 'email'
  }], function on_error(err, req, res, next) {
    errored_out = true;
    t.ok(err, 'we should have an error');
    next();
  });

  val({}, null, function () {
    t.equal(errored_out, true, 'and we should have errored out');
    t.end();
  });
});

test("on error should fire only once", function (t) {
  var fired = 0;

  var val = Val.validate([{
    required: 'email'
  }, {
    required: 'email'
  }], function on_error(err, req, res, next) {
    fired++;
    t.ok(err, 'we should have an error');
    next();
  });

  val({}, null, function () {
    setTimeout(function () {
      t.equal(fired, 1, 'it should only error out once, dont call that multiple times');
      t.end();
    }, 50);
  });
});

test("no email param in request but it is required", function (t) {
  var errored_out = false;

  var val = Val.validate([{
    required: 'email'
  }], function on_error(err, req, res, next) {
    errored_out = true;
    t.ok(err, 'we should have an error here cause no email params exist in the request object');
    next();
  });

  val({
    params: {
      foo: 'bar'
    }
  }, null, function () {
    t.equal(errored_out, true, 'and we should have errored out');
    t.end();
  });
});

test("email in the wrong format", function (t) {
  var errored_out = false;

  var val = Val.validate([{
    required: 'email'
  }], function on_error(err, req, res, next) {
    errored_out = true;
    t.ok(err, 'we should have an error because the email is not valid');
    next();
  });

  val({
    params: {
      email: 'bar'
    }
  }, null, function () {
    t.equal(errored_out, true, 'totally errored out');
    t.end();
  });
});

// email is optional and does not exist, validation is ok
// email is optional but fails validation
// test for non basic validation, with advanced checks
