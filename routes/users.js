var express = require('express');
const {query} = require("winston");
var router = express.Router();

/* GET users listing. */

router.route("/")
    .get((req, res, next) => {
        console.log('Cookies: ', req.cookies)
        console.log('app: ', req.app)
        console.log('body: ', req.body)
        console.log('ip: ', req.ip)
        res.send('<h1>respond with a get</h1> resource1111');
    })
    .post((req, res, next) => {
        console.log('parameter->');
        res.send('<h1>respond with a post</h1> resource1111=>' + req.params.id + "===" + req.query.limit);
    });


router.get("/example", (req, res, next) =>{

    res.render("example", {
        text:"동해물과 백두산이",
        text2 :"하나님이 보우하사",
        text3 : "우리나라 만세!!!!",
        text4:['사과','바나나','오렌지']
    })
})

module.exports = router;
