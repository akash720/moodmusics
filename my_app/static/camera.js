// References to all the element we will need.
var video = document.querySelector('#camera-stream'),
  image = document.querySelector('#snap'),
  start_camera = document.querySelector('#start-camera'),
  controls = document.querySelector('.controls'),
  take_photo_btn = document.querySelector('#take-photo'),
  delete_photo_btn = document.querySelector('#delete-photo'),
  save = document.querySelector('#save_photo'),
  proceed_btn = document.querySelector('#proceed'),
  error_message = document.querySelector('#error-message'),
  localStream = null,
  start = 1,
  start_stop_btn = document.querySelector('#start_stop'),
  hidden_canvas = document.querySelector('canvas');

  var strImage = null;
  var imageURI = null;
// The getUserMedia interface is used for handling camera input.
// Some browsers need a prefix so here we're covering all the options
navigator.getMedia = ( navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);


if(!navigator.getMedia){
  displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
}
else{

  // Request the camera.
  navigator.getMedia(
  {
    video: true
  },
    // Success Callback
    function(stream){

      localStream = stream;
      // Create an object URL for the video stream and
      // set it as src of our HTLM video element.
      try {
        video.srcObject = stream;
      } catch (error) {
        video.src = window.URL.createObjectURL(stream);
      }
      // Play the video element to start the stream.
      video.play();
      video.onplay = function() {
        showVideo();
        start_stop_btn.style = "visibility = visible";
      };

    },
    // Error Callback
    function(err){
      displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
    }
    );

}



// Mobile browsers cannot play video without user input,
// so here we're using a button to start it manually.
start_camera.addEventListener("click", function(e){

  e.preventDefault();

  // Start video playback manually.
  video.play();
  showVideo();

});


take_photo_btn.addEventListener("click", function(e){

  e.preventDefault();

  var snap = takeSnapshot();

  // Show image. 
  image.setAttribute('src', snap);
  image.classList.add("visible");

  // Enable delete,take_photo and proceed buttons
  delete_photo_btn.classList.remove("disabled");
  //download_photo_btn.classList.remove("disabled");
  proceed_btn.classList.remove("disabled");
  
  take_photo_btn.classList.add('disabled');
  save.href = snap;
  save.style = "visibility: visible";
  // Set the href attribute of the download button to the snap url.
  //download_photo_btn.href = snap;

  //proceed = document.querySelector("#proceed");
  //proceed.style="visibility: visible";

  // Pause video playback of stream.
  video.pause();

});


delete_photo_btn.addEventListener("click", function(e){

  e.preventDefault();

  // Hide image.
  image.setAttribute('src', "");
  image.classList.remove("visible");

  save.style = "visibility: hidden";
  
  // Disable delete and save buttons
  delete_photo_btn.classList.add("disabled");
 // download_photo_btn.classList.add("disabled");
 proceed_btn.classList.add("disabled");
 if(video.srcObject != null){
  take_photo_btn.classList.remove('disabled');
}
  //proceed = document.querySelector("#proceed");
  //proceed.style="visibility: hidden";

  // Resume playback of stream.
  video.play();

});



function showVideo(){
  // Display the video stream and the controls.

  hideUI();
  video.classList.add("visible");
  controls.classList.add("visible");
}


function takeSnapshot(){
  // Here we're using a trick that involves a hidden canvas element.  

  var context = hidden_canvas.getContext('2d');

  var width = video.videoWidth,
  height = video.videoHeight;

  if (width && height) {

    // Setup a canvas with the same dimensions as the video.
    hidden_canvas.width = width;
    hidden_canvas.height = height;

    // Make a copy of the current frame in the video on the canvas.
    context.drawImage(video, 0, 0, width, height);

    imageData = hidden_canvas.toDataURL('image/png');
    strImage = imageData.replace(/^data:image\/[a-z]+;base64,/, "");
    
    // Turn the canvas image into a dataURL that can be used as a src for our photo.
    return imageData;
  }
}

proceed_btn.addEventListener("click", function(e){

  e.preventDefault();
  $('form input[name=image_data]').val(strImage);
  $('form').submit();
  // $.post('player/', {'imageDataURI' : strImage })
  /* $.ajax({
            url: '/player/',
            data: {'imageDataURI' : strImage },
            type: "POST",
            dataType: 'json',
            success: function () {
              console.log("process complete"); 
            }
          }); */
});



function displayErrorMessage(error_msg, error){
  error = error || "";
  if(error){
    console.log(error);
  }

  error_message.innerText = error_msg;

  hideUI();
  error_message.classList.add("visible");
}


function hideUI(){
  // Helper function for clearing the app UI.

  controls.classList.remove("visible");
  start_camera.classList.remove("visible");
  video.classList.remove("visible");
  snap.classList.remove("visible");
  error_message.classList.remove("visible");
}

function stopStreamedVideo(videoElem) {

  let tracks = localStream.getTracks();
  video.srcObject = null;
  tracks.forEach(function(track) {
    track.stop();
  });
}

start_stop.addEventListener("click", function(e) {
  e.preventDefault();

  if(start == 1) {
    stopStreamedVideo(video);
    start = 0;  
    $('#start_stop').html('Start camera');
    take_photo_btn.classList.add('disabled');
  }
  else {
    // Request the camera.
    navigator.getMedia(
    {
      video: true
    },
        // Success Callback
        function(stream){

          localStream = stream;
          // Create an object URL for the video stream and
          // set it as src of our HTLM video element.
          try {
            video.srcObject = stream;
          } catch (error) {
            video.src = window.URL.createObjectURL(stream);
          }
          // Play the video element to start the stream.
          video.play();
          video.onplay = function() {
            showVideo();
          };

          take_photo_btn.classList.remove('disabled');

          start = 1;
          $('#start_stop').html('Stop camera');
        },
        // Error Callback
        function(err){
          displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
        }
        );
  }
});