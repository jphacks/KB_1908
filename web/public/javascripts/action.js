window.onload = () => {
  var video = document.getElementById('camera');
  var canvas = document.getElementById('picture');
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
    setTimeout( () => {
      video.play();
    }, 500);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var image = canvas.toDataURL('image/png');

  });
};
  