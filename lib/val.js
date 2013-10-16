(function () {
  var basic_types = {
    email: /@/
  };

  var basic_eg = {
    email: 'foo@bar.com'
  };

  module.exports = function (opts) {
    return new Val(opts);
  };

  function Val(opts) {
    if (!(this instanceof Val)) {
      return new Val(opts);
    }
    //
    // this is where you set up where params live
    // what is body
    // if parsing needs to exist
    // etc
    //
    // right now i dont need any of that cause im going to couple this
    // to restify, so change to fit your needs
    //
    // if you are changing and want this to be accepted back main stream
    // be nice and make sure you add proper tests and everything _just works_
    //
    // if not i advise you to fork it, and use at your own risk and have wonderful adventures
    // — but without me having to maintain them :)
    //
    this.params = opts && opts.params || 'body';
  }

  Val.prototype.validate = function (schema, cb) {
    var self = this;
    return function validate(req, res, next) {
      //
      // a schema is an array of validations
      // we need to iterate each
      //
      for (var i in schema) {
        var def = schema[i];
        //
        // we first need to see if this field is required
        // or optional. we might still give a validation error
        // on a optional parameter
        //

        //
        // required parameter
        //
        if (def.required) {
          //
          // an example would be `email`, or a non simple validation
          //
          var prop = def.required;
          //
          // if this is a basic property that we already know and love
          //
          if (basic_types[prop]) {
            //
            // params don't exist in the request, this is likely a bad failure
            // because the program is miss configured or the framework you are using
            // doesnt always allocate this variable. either way, validation failed
            //
            if (!req[self.params]) {
              cb(new Error(['We could not find any parameters for this request, hence we did not find a ',
                prop,
                ' parameter in your request.',
                ' Please do try again but this time specifying your parameter. e.g. /myurl?',
                prop,
                '=foobar.'
              ].join('')), req, res, next);
              return;
            }

            //
            // we have params, but do we have the required parameter?
            //
            var params = req[self.params];

            //
            // if params does not include the property that is required, our validation needs to fail
            //
            if (!params[prop]) {
              cb(new Error(['We could not find parameter ',
                prop,
                ' in your request.',
                ' Please do try again but this time specifying your parameter. e.g. /myurl?',
                prop,
                '=foobar.'
              ].join('')), req, res, next);
              return;
            }

            //
            // lets see if it matches the basic rule defined
            //
            var parameter_value = params[prop];

            //
            // if we can't match the basic validation we need to fail
            //
            if (!basic_types[prop].test(parameter_value)) {
              cb(new Error(['The parameter you specified in ',
                prop,
                ' was invalid `',
                parameter_value,
                '`. Sorry about that. ',
                ' Please do try again but this time specifying this parameter correctly. e.g. ',
                basic_eg[prop]
              ].join('')), req, res, next);
              return;
            }

            //
            // oh joy oh joy next()
            //
            next();
          }
          //
          // we need to look for more data
          //
          else {
            //
            // not supported as a function of lazyness
            //
          }
        }
        //
        // optional parameter
        //
        else {
          //
          // who needs optional validations anyway
          // i mean, i dont right now
          // this is like that book you buy where they give you blank pages to write
          // the guy didnt care, you bought it anyway. go right, send your pull request
          // while you are at it make this code DRY. You are aswm!
          //
        }
      }
    };
  };

})(typeof exports === "undefined" ? module = {} : module);
