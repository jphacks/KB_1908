var image;

window.onload = () => {

  var video = document.getElementById('camera');
  var canvas = document.getElementById('picture');
  canvas.style.display ="none";
  var se = document.getElementById('se');

  var constraints = {
    audio: false,
    video: {
      width: 300,
      height: 200,
      facingMode: "user"   // フロントカメラ　後ろは"environment"
    }
  };

  navigator.mediaDevices.getUserMedia(constraints)
  .then( (stream) => {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
      video.play();
    };
  })
  .catch( (err) => {
    console.log(err.name + ": " + err.message);
  });

  document.getElementById('shutter').addEventListener('click', () => {
    var ctx = canvas.getContext('2d');

    video.pause();
    se.play();
    // setTimeout( () => {
    //   video.play();
    // }, 500);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    image = canvas.toDataURL('image/png');
    image = image.split(",")[1];
    post();
    // setTimeout("result()", 3000);
    result()
  });
};
function result() {
  window.location.href = '../video.html';
}

function post(){
  $.ajax({
    url: '/postImg',
    type: 'POST',
    data: {
      "image": image
    }
  }).done(function( data, textStatus, jqXHR ) {
    //成功
    console.log("success");
    console.log(data);
    
  }).fail(function( jqXHR, textStatus, errorThrown) {
    //失敗
    console.log("failure");
    console.log(textStatus);
  }).always(function( jqXHR, textStatus) {
    //通信完了
    console.log("finish");
  });
}