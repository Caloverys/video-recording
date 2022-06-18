<!DOCTYPE html>

<html lang="en">
<meta charset="UTF-8">

<head>

<style>
  body{
    overflow: scroll;
  }
  video{
    transform: scaleX(-1);
  }

</style>

</head>

<body>
   <input type="checkbox" id='cursor_checkbox' checked>
   <label for='cursor_checkbox'>Display cursor</label>
   <button id="id-stop-button" disabled>
      Stop and clear MediaStream
    </button>
    <h3 id="id-title">Device labels</h3>
    <div id="id-device-labels"></div>
  <video></video>
  <i class="fas fa-expand"></i>
  <script src='https://kit.fontawesome.com/44f674442e.js'></script>
  <button id='record_button'>Record</button>
  <button id='toggle_button'>Full screen</button>
  <button onclick='take_screen_shot()'>Take</button>
  <button id='screen_capture_button'>Take</button>
<script type="text/javascript">
  let constraints,stream,previous_URL;
  const record_button = document.querySelector('#record_button');
  const toggle_button = document.querySelector('i.fas.fa-expand');
  const screen_capture_button = document.querySelector('#screen_capture_button')

 constraints = { audio: true, video: { width: 1280, height: 720 } };

  const video = document.querySelector('video')
navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream) {
  stream = mediaStream;
  video.srcObject = mediaStream; 
  video.onloadedmetadata = function(e) {
    video.play();
  };
})

record_button.addEventListener('click',function(){
record_video()
})

function record_video(){
   const recording = new MediaRecorder(stream,{
    mimeType: "video/webm",
  })
   let data = [];
   recording.ondataavailable = event =>{
    data.push(event.data)
    create_video(event.data,"untitle.webm")
   } 
  recording.start();
}

function take_screen_shot(){

  const canvas = document.createElement('canvas')
  canvas.width = 640;
  canvas.height  =480;
  const context = canvas.getContext('2d')
  context.drawImage(video,0,0,canvas.width,canvas.height)
  const dataURL = canvas.toDataURL('image/jpg')
  create_video(dataURL,true,'untitle.jpg')

}


function togglescreen(elem){
  if(!elem.fullScreenElement || !elem.mozFullScreen || !elem.webkitIsFullScreen){
     if (elem.requestFullScreen){
            elem.requestFullScreen();
        }
        else if (elem.mozRequestFullScreen){ /* Firefox */
            elem.mozRequestFullScreen();
        }
        else if (elem.webkitRequestFullScreen){   /* Chrome, Safari & Opera */
            elem.webkitRequestFullScreen();
        }
        else if (elem.msRequestFullscreen){ /* IE/Edge */
            elem.msRequestFullscreen();
        }
  }
  else
    {
        if (elem.cancelFullScreen){
           elem.cancelFullScreen();
        }
        else if (elem.mozCancelFullScreen){ /* Firefox */
            elem.mozCancelFullScreen();
        }
        else if (elem.webkitCancelFullScreen){   /* Chrome, Safari and Opera */
            elem.webkitCancelFullScreen();
        }
        else if (elem.msExitFullscreen){ /* IE/Edge */
            elem.msExitFullscreen();
        }
    }


}

screen_capture_button.addEventListener('click',function(){
  const displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};
navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(screen_media=>{
  const recording = new MediaRecorder(screen_media)
  recording.ondataavailable= event => create_video(event.data,"untitle.webm")
  recording.start()
})
.catch(error=>{
if(error == "NotAllowedError"){
  check_user_broswer()
}
})
})

function create_video(src,download_name,download_only = false,){
  const video = document.createElement("video");
  previous_URL = URL.createObjectURL(src)

  if(!download_only){
  video.setAttribute("controlsList", "nodownload");
  video.src = previous_URL;
  //set controls property for video which makes user able to control the video element
  video.setAttribute('controls','controls')
  document.body.appendChild(video);
}
  create_download_URL(previous_URL)
}

function create_download_URL(url,download_name){
const a = document.createElement('a')
  a.download  = download_name;
  a.href = previous_URL
  a.textContent = a.download;

  document.body.appendChild(a)

}

function check_user_broswer(){
//!! is just to do a boolean check, it is equivalent to  
const is_IE = false || !!document.documentMode;
const is_Edge = !is_IE && !!window.StyleMedia;
if(navigator.userAgent.indexOf("Chrome") != -1 && !isEdge) browser_name = 'Chrome';

else if(navigator.userAgent.indexOf("Safari") != -1 && !isEdge) browser_name = 'Safari';

else if(navigator.userAgent.indexOf("Firefox") != -1 ) browser_name = 'Firefox';

else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) browser_name = 'IE';

else if(isEdge) browser_name = 'Edge';

else browser_name = 'other-browser';

return browser_name;
}
</script>  
</body>
