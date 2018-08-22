var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// 在设计每一个页面时，可能会存在公用的视图，在开发时，为了不重负编写代码，我们把公用的视图抽离出来，封装到一个公共的模版中（如layout.ejs）让每一个页面都继承layout.ejs中公共视图，ejs-mate模块就是提供此功能
// 类似的模快还有express-parital等若不想使用模块还有ejs的include等
var engine = require('ejs-mate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentsRouter = require('./routes/students');
var teachersRouter = require('./routes/teachers');


var app = express();

// view engine setup
app.engine('ejs',engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(session({
  secret: 'stu-manage',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:1000 * 60 *60 *3 }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(usersRouter);
app.use('/students',studentsRouter);
app.use('/teachers',teachersRouter);

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
