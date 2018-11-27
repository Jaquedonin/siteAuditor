var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session'); 

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var videoRouter = require('./routes/videos');

var app = express();

app.disable('x-powered-by')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//session é uma propriedade que pode ser acessada em todas as requisições
//guarda os valores da sessão "token", "professorId" e "professorName"
app.use(session({
    name: 'session',
    secret: '',
    saveUninitialized: false,
    resave: false,
    httpOnly: true
}));
  
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/', videoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render("not-found");
});

// error handler
app.use(function(err, req, res, next) {
    res.render("not-found");  
});

module.exports = app;
