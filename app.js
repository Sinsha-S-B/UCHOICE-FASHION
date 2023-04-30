


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileupload=require("express-fileupload")
const hbs=require('express-handlebars');

var session=require("express-session")





var app = express();

const hbsHelpers = {
  incIndex: function(index) {
    return index + 1;
  }
};

// view engine setup
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:"layout",layoutsDir:__dirname+'/views',partialsDir:__dirname+"/views/partials",helpers:hbsHelpers}))
app.set('views', path.join(__dirname, 'views'));






app.set('view engine', 'hbs');
const hb=hbs.create({})
hb.handlebars.registerHelper('eq',function(a,b){
  return a==b
});
hb.handlebars.registerHelper('gte',function(a,b){
  return a>=b
});

app.use(session({secret:"key",resave:true,saveUninitialized:true,cookie:{maxAge:60*60000}}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(fileupload())
app.use(fileupload({useTempFiles:true,tempFileDir:'/temp/'}))




var usersRouter = require('./routes/usersRouter');
var adminRouter= require('./routes/adminRouter');

app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
