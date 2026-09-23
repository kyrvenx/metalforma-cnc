var createError = require('http-errors' );
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var transportesRouter = require('./routes/transportes');
var adminRouter = require('./routes/admin');
var novedadesRouter = require('./routes/novedades');
var usuariosApiRouter = require('./routes/usuarios');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
} ));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'metalforma-clave-local',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 4
  }
} ));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/transportes', transportesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/novedades', novedadesRouter);
app.use('/api/usuarios', usuariosApiRouter);


app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;