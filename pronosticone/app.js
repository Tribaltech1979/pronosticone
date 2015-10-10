var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var fs = require('fs');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var dbfile = 'db.sk';
var configuration = JSON.parse(fs.readFileSync(dbfile));

var multer =   require('multer');
var upload      =   multer({ dest: './public/img/team/'});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret : 'provaprovaprovaprova',
                 resave: false,
                 saveUninitialized: true
                    }));
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use(multer({ dest: './public/img/team/',
    rename: function (fieldname, filename) {
        return filename+Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
}));*/

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100,
    host :  configuration.database,
    user : configuration.username,
    password :configuration.password,
    database : 'pronosticone',
    debug : false,
    dateStrings :true,
    multipleStatements : true
});

app.use(function(req,res,next){
   req.pool = pool;
    req.upload = upload;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
