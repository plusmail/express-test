var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
const morganMiddleware = require('./morganMiddleware');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
const nunjucks = require('nunjucks');

const {sequelize} = require('./models/index')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

sequelize.sync({force: false})
    .then(() => {
        console.log("데이터베이스 연결 성공 했지롱!!!");
    })
    .catch((err) => {
        console.log(err);
    })

const {User, Comment} = require('./models')
const {Op} = require('sequelize');
// User.create({
//     name : "홍길동",
//     age : 30,
//     address : "대전광역시",
//     married : false,
//     comment : "재밋는 사람",
// });

// User.findAll({
//     attributes: ['name', 'married'],
//     where : {
//         'married' : 1,
//         'age' : { [Op.gte] : 30}
//     }
// }).then((result)=> {
//     console.log(result);
// });

// User.update({
//     comment: '수정합니다11111.',
// }, {
//     where: {'id': 24},
// }).then((r) => {
//     console.log("수정완료")
// })

const user = User.findOne({
    include : [{
        model : Comment,
        attributes : ['id', 'comment'],
    }]
}).then( r => {
    console.log("조인 완료" ,r);
}).catch( e => {
    console.log(e);
})

nunjucks.configure('views', {express: app, watch: true})
app.set('view engine', 'html');

app.use(morganMiddleware);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({  // 2
    secret: 'keyboard cat',  // 암호화
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

app.post('/upload', upload.single('image1'), (req, res) => {
    console.log(req.file, req.body);
    res.send('OK');
})


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
