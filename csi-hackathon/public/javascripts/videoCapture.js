var video = document.getElementById('video');

// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Not adding `{ audio: true }` since we only want video now
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();
  });
}

function picSnap() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  document.getElementById('capture').addEventListener('click', () => {
    context.drawImage(video, 0, 0, 400, 300);
    let data = canvas.toDataURL('image/png');
    var formData = new FormData();
    formData.append("imageupload", data);
    console.log(formData)
    axios
      .post('/users/imageUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  });
  // canvas.toBlob(blob => {
  //   let file = saveAs(blob, 'newImage.jpg');
  //   var formData = new FormData();
  //   formData.append('file', file, 'newImage.png');

  //   axios
  //     .post('/users/imageUpload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //     .then(res => {
  //       console.log(res);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // });
  //   });
}
