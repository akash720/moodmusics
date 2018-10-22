// References to all the element we will need.
var video = document.querySelector('#camera-stream'),
  image = document.querySelector('#snap'),
  start_camera = document.querySelector('#start-camera'),
  controls = document.querySelector('.controls'),
  take_photo_btn = document.querySelector('#take-photo'),
  delete_photo_btn = document.querySelector('#delete-photo'),
  save = document.querySelector('#save_photo'),
  proceed_btn = document.querySelector('#proceed'),
  instructions_btn = document.querySelector('#instructions'),
  error_message = document.querySelector('#error-message'),
  error_ins = document.querySelector('#error_instructions'),
  localStream = null,
  start = 1,
  start_stop_btn = document.querySelector('#start_stop'),
  hidden_canvas = document.querySelector('canvas'),
  strImage = null,
  imageURI = null,
  visited = localStorage.getItem('visited');

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
  proceed_btn.classList.remove("disabled");
  take_photo_btn.classList.add('disabled');

  // Set the href attribute of the download button to the snap url.
  save.href = snap;

  //enable save button
  save.style = "visibility: visible";
  video.pause();

});


delete_photo_btn.addEventListener("click", function(e){

  e.preventDefault();

  // Hide image.
  image.setAttribute('src', "");
  image.classList.remove("visible");

  //hide save button
  save.style = "visibility: hidden";
  
  // Disable delete and proceed buttons
 delete_photo_btn.classList.add("disabled");
 proceed_btn.classList.add("disabled");

 if(video.srcObject != null){
  take_photo_btn.classList.remove('disabled');
}

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
  // Here we're using a hidden canvas element.  

  var context = hidden_canvas.getContext('2d');

  //initialize width & height to video input dimensions
  var width = video.videoWidth,
      height = video.videoHeight;

  if (width && height) {

    // Setup a canvas with the same dimensions as the video.
    hidden_canvas.width = width;
    hidden_canvas.height = height;

    // Make a copy of the current frame in the video on the canvas.
    context.drawImage(video, 0, 0, width, height);

    // Turn the canvas image into a dataURL that can be used as a src for our photo.
    imageData = hidden_canvas.toDataURL('image/png');
    strImage = imageData.replace(/^data:image\/[a-z]+;base64,/, "");
    
    return imageData;
  }
}

proceed_btn.addEventListener("click", function(e){

  e.preventDefault();

   // Disable button for multiple tap
  proceed_btn.classList.add("disabled");

  //post request to send image_data
  $('form input[name=image_data]').val(strImage);
  $('form').submit();
});

function displayErrorMessage(error_msg, error){
  error = error || "";
  if(error){
    console.log(error);
  }
  var instructions_link = error_message.innerHTML;
  error_message.innerHTML = error_msg+ "\n\n" + instructions_link ;

  document.querySelector('#error_instructions').addEventListener('click', function(){
    swal("1. To the left of the web page address, click the Lock or Info icon \
     \n2. Click Site Settings\n3. Change 'Access your Camera' to allow\n4. Refresh the page");
  });

  hideUI();
  error_message.classList.add("visible");
  error_ins.classList.add("visible");
}

function hideUI(){
  // Helper function for clearing the app UI.

  controls.classList.remove("visible");
  start_camera.classList.remove("visible");
  video.classList.remove("visible");
  snap.classList.remove("visible");
  error_message.classList.remove("visible");
  error_ins.classList.remove("visible");
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

  //change url text and its function
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

if(!visited){
	window.onload = popup();
	localStorage.setItem('visited', 'yes');
}


function popup() {
  swal("Instructions", "1. Please allow camera permission to use the app.\n 2. Please ensure that your are under proper lighting.\
    \n3. If the camera fails to detect your mood, the page will reload automatically.\
    \n4. Your photo will never be saved anywhere.", "info").then(function() 
    { 
      var anno1 = new Anno(
        [{
        target : '#take-photo',
        position: 'center-bottom',
        content: 'Use this to take photo',
        onShow: function () {
            take_photo_btn.style.pointerEvents = 'none';
          },
        onHide: function() {
            take_photo_btn.style.pointerEvents = 'auto';
          }
        },
        {
        target : '#delete-photo',
        position: 'center-bottom',
        buttons: [AnnoButton.BackButton, AnnoButton.NextButton],
        content: 'Use this to delete a photo',
        onShow: function () {
            take_photo_btn.style.pointerEvents = 'none';
          },
        onHide: function() {
            take_photo_btn.style.pointerEvents = 'auto';
          }
        },
        {
        target : '#proceed',
        position: 'center-bottom',
        buttons: [AnnoButton.BackButton, AnnoButton.DoneButton],
        content : 'Use this to proceed to mood detection',
        onShow: function () {
            take_photo_btn.style.pointerEvents = 'none';
          },
        onHide: function() {
            take_photo_btn.style.pointerEvents = 'auto';
          }
      }]
      );    
      anno1.show();
    }); 
}

instructions_btn.addEventListener("click", function(e){
  e.preventDefault();
  popup();
});
