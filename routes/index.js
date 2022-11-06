var express = require('express');
var router = express.Router();
const logger = require("../logger");


const multer = require('multer');
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req,file, done){
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits:{fileSize: 5 * 1024 * 1024},
})


/* GET home page. */
router.get('/', function(req, res, next) {
  logger.info(req.session);

  if(!req.session.num){
    req.session.num = 1;
  } else {
    req.session.num = req.session.num + 1;
  }
  req.session.is_logined = true;
  req.session.nickname = "Gildong";
  req.session.save(err => {
    if (err) throw err;
  });


  res.cookie('hasVisited', '1', {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    maxAge: 60*60*1000,
    httpOnly: true,
    path:'/'
  });

  res.render('index', { title: 'Express' , num : req.session.num});
});

module.exports = router;
