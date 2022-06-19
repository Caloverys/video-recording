<!DOCTYPE html>

<html lang="en">
<meta charset="UTF-8">

<head>

<link rel='stylesheet' href='video_recording.css'>

</head>

<body>
   <input type="checkbox" id='cursor_checkbox' checked>
<label for='cursor_checkbox'>Display cursor</label>
<button id="id-stop-button" disabled>
      Stop and clear MediaStream
    </button>
<div id="id-device-labels"></div>
<div id='video_container' >
  <video id='preview'></video>
   <div id='button_container'>
    <div id='container_of_record_button'>
      <button id='record_button'></button>
    </div>
    <i id='full_screen_button' class="fas fa-expand"></i>
    <i id='screenshot_button' class="fa-solid fa-camera"></i>
    <i id='setting_button' class="fa-solid fa-gear"></i>
  </div>

</div>
<div class='tooltip'>
    <div id='microphone'>
        Microphone: 
        <ul>
            <li></li>
        </ul>
        <button>
            <i></i>
        </button>
    </div>
</div>
 
  <script src='https://kit.fontawesome.com/44f674442e.js'></script>
  <button id='toggle_button'>Full screen</button>
  <button id='screen_capture_button'>Take</button>

  <script id='convert_webm_to_mp4_worker' type='javascript/worker'>
importScripts("https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js");
const start_time = performance.now()
function print(text) {
  postMessage({
    "type": "stdout",
    "data": text
  });
};
onmessage = function(event) {
  var message = event.data;
  if (message.type === "command") {
    var Module = {
      print: print,
      printErr: print,
      files: message.files || [],
      arguments: message.arguments || [],
      TOTAL_MEMORY: message.TOTAL_MEMORY || false
    };

    const result = ffmpeg_run(Module);
    const totalTime = performance.now() - start_time;

    postMessage({
      "type": "done",
      "data": result,
      "time": totalTime
    });
  }
};
postMessage({
  "type": "ready"
});
  </script>
<script type="text/javascript" src='video_recording.js'></script>  
</body>
