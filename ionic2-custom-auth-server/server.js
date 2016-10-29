var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var secret = 'yourSuperSecretPassword'
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

// handle Ionic Auth
app.get('/auth', function(req, res){

    // verify the incoming JWT

    try {
      var incomingToken = jwt.verify(req.query.token, secret);
    } catch (ex) {
      console.error(ex.stack);
      return res.status(401).send('jwt error');
    }

    // do whatever auth stuff you want with the users details

    var email = incomingToken.data.email;
    var password = incomingToken.data.password;
    var user_id;

    if(email == 'me@test.com' && password == 'password'){

        // user authentication was successful, assign whatever data you want
        user_id = '123';
        console.log('Authenticated now...');
    }

    // construct JWT and redirect to the redirect_uri

    var outgoingToken = jwt.sign({"user_id": user_id}, secret);
    var url = req.query.redirect_uri +
        '&token=' + encodeURIComponent(outgoingToken) +
        '&state=' + encodeURIComponent(req.query.state);

    return res.redirect(url);

});

app.listen(app.get('port'));
console.log("App listening on " + app.get('port'));
