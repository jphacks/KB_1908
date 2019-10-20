var express = require('express');
var gene = require('./juiceGenerator');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var fs = require("fs");

const vision = require('node-cloud-vision-api')


var categories = ['joy', 'sorrow', 'anger', 'surprise']
var result = { "joy": 0,"sorrow" :0,"anger":0,"surprise":0}
// init with auth
vision.init({
    auth: 'AIzaSyCAdkejP6GBbOP1iC0Kq5g8Lhq6R7vf4uY'
})

var app = express();


app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit:'50mb',extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.post('/postImg', function (request, response) {
  var data = request.body;
  var img = JSON.stringify(data.image);
  
//   console.log(img);
    var facialExpression = [];
    var decode = new Buffer(img, 'base64');
    
    const req = new vision.Request({
      image: new vision.Image('public/image/face.png'),
      features: [
        new vision.Feature('FACE_DETECTION', 1)
        // new vision.Feature('LABEL_DETECTION', 10),
      ]
    })
    // send single request
    vision.annotate(req).then((res) => {
    // handling response
    facialExpression.push(res.responses[0].faceAnnotations[0].joyLikelihood);
    facialExpression.push(res.responses[0].faceAnnotations[0].sorrowLikelihood);
    facialExpression.push(res.responses[0].faceAnnotations[0].angerLikelihood);
    facialExpression.push(res.responses[0].faceAnnotations[0].surpriseLikelihood);


    for (var k = 0; k < facialExpression.length; k++) {
      if (facialExpression[k] == 'UNKNOWN') {
        facialExpression[k] = 0;
      } else if (facialExpression[k] == 'VERY_UNLIKELY') {
        facialExpression[k] = 1;
      } else if (facialExpression[k] == 'UNLIKELY') {
        facialExpression[k] = 2;
      } else if (facialExpression[k] == 'POSSIBLE') {
        facialExpression[k] = 3;
      } else if (facialExpression[k] == 'LIKELY') {
        facialExpression[k] = 4;
      } else if (facialExpression[k] == 'VERY_LIKELY') {
        facialExpression[k] = 5;
      }
    }
    for (var k = 0; k < facialExpression.length; k++) {
        console.log(categories[k] + ":" + facialExpression[k])
    }
    result.joy = facialExpression[0]
    result.sorrow = facialExpression[1]
    result.anger = facialExpression[2]
    result.surprise = facialExpression[3]
    
    if (result.joy > result.sorrow && result.joy > result.anger && result.joy > result.surprise) {
      gene.brewO();
      console.log("joy")
    } else if (result.sorrow > result.joy && result.sorrow > result.anger && result.sorrow > result.surprise) {
      gene.brewVO();
      console.log("sorrow")
    } else if (result.anger > result.joy && result.anger > result.sorrow && result.anger > result.surprise) {
      gene.brewJ();
      console.log("anger")
    } else if (result.surprise > result.joy && result.surprise > result.sorrow && result.surprise > result.anger) {
      gene.brewEV();
      console.log("surpreise")
    } else {
      gene.brewOJEV();
      console.log(result);
      console.log("all")
    }
      

    }, (e) => {
        console.log('Error: ', e)

    })
    
  fs.writeFile('public/image/face.png', decode, function (err) {
    
    console.log(err);
    
    
  });
    
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  response.end()
    
});

app.get('/result', (req, res, next) => {
  res.json(result);
    
});


module.exports = app;

