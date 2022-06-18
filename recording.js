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
  #parent_div{
     border: 5px solid #64686B;
     width: 4vw;
    height: 4vw;
     border-radius: 50%;
     display: flex;
  justify-content: center;
  align-items: center;
    
  }
  #record_button{

    display: inline-block;
    border-radius: 50%;
    border: none;
    width: 3.5vw;
    height: 3.5vw;
    background-color: red;
  
}
.active{
    border-radius: 5px !important;
    width: 1.75vw !important;
    height:1.75vw !important;
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
  <div id='parent_div'>
  <button id='record_button'></button>
</div>
  <button id='toggle_button'>Full screen</button>
  <button onclick='take_screen_shot()'>Take</button>
  <button id='screen_capture_button'>Take</button>

  <script id='convert_webm_to_mp4_worker' type='javascript/worker'>
importScripts("https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js");
var now = Date.now;

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
    postMessage({
      "type": "start",
      "data": Module.arguments.join(" ")
    });
    postMessage({
      "type": "stdout",
      "data": "Received command: " + Module.arguments.join(" ") + ((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")
    });
    var time = now();
    var result = ffmpeg_run(Module);
    var totalTime = now() - time;
    postMessage({
      "type": "stdout",
      "data": "Finished processing (took " + totalTime + "ms)"
    });
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
<script type="text/javascript">
/* 
ask for user permissin first to prevent future asking 

*/
/*window.addEventListener('DOMContentLoaded', () => {
    navigator.mediaDevices.getUserMedia({
      audio:true,
      video:true,
    })
});*/
  let constraints,stream,previous_URL,strem;
  const record_button = document.querySelector('#record_button');
  const parent_of_record_button = document.querySelector('#parent_div')
  const toggle_button = document.querySelector('i.fas.fa-expand');
  const screen_capture_button = document.querySelector('#screen_capture_button')
  const cursor_checkbox = document.querySelector('#cursor_checkbox')
   //the default value for displaying cursor is always 
  let is_display_cursor = "always"
 constraints = { audio: false, video: { width: 1280, height: 720 } };
 let video_recording;

  const video = document.querySelector('video')

cursor_checkbox.addEventListener('click',function(){
  if(cursor_checkbox.checked) is_display_cursor = "always"
    else is_display_cursor = 'none'
})
window.addEventListener('load',function(){
navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream) {

   //console.console.log(MediaStreamTrack.getConstraints())
      console.log(mediaStream.getTracks())
  //.map( (track) => console.console.log(track.getSettings()));
  stream = mediaStream;

  video.srcObject = mediaStream; 
  video.onloadedmetadata = function(e) {
    video.play();
  };

})
})

parent_of_record_button.addEventListener('click',function(){
    if(!record_button.classList.contains('active')){
        record_button.classList.add('active');
        start_video();
    }else{
        record_button.classList.remove('active')
        stop_video();
    }
})

function start_video(){
   video_recording = new MediaRecorder(stream,{
    mimeType: "video/webm",
  })
   let data = [];
  video_recording.ondataavailable = event =>{
    data.push(event.data)
    create_video(event.data, "untitle.webm")

    convertStreams(new Blob([event.data], {
    type: "video/x-matroska;codecs=avc1"
}))
    
   } 
  video_recording.start();
}

                  var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
                //if(document.domain == 'localhost') {
                  //  workerPath = location.href.replace(location.href.split('/').pop(), '') + 'ffmpeg_asm.js';
                //}

                function processInWebWorker() {
                    var blob = URL.createObjectURL(new Blob([document.querySelector('#convert_webm_to_mp4_worker').textContent]));

                    var worker = new Worker(blob);
                    URL.revokeObjectURL(blob);
                    return worker;
                }

                var worker;

                function convertStreams(videoBlob) {
                    console.log(videoBlob)

                    window.aab;
                    var buffersReady;
                    var workerReady;
                    var posted;

                    var fileReader = new FileReader();
                    fileReader.onload = function() {
                       console.log(this.result)
                        aab = this.result;
                        postMessage();
                    };
                     fileReader.readAsArrayBuffer(videoBlob);
                    


                    if (!worker) {
                        worker = processInWebWorker();
                    }

                    worker.onmessage = function(event) {
                        const message = event.data;
                        if (message.type == "ready") {
                            workerReady = true;
                            if (buffersReady) postMessage();
                        }  else if (message.type == "stdout") {
                            console.log(message.data);
                        } else if (message.type == "start") {
                            console.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
                        } 
                        else if (message.type == "done") {
                            console.log(JSON.stringify(message));

                            var result = message.data[0];
                            console.log(JSON.stringify(result));

                            var blob = new File([result.data], 'test.mp4', {
                                type: 'video/mp4'
                            });

                            console.log(JSON.stringify(blob));

                            create_video(blob,"untitle.mp4")
                        }
                    };
                    var postMessage = function() {
                        posted = true;
                        console.log(new Uint8Array(aab))

                        worker.postMessage({
                            type: 'command',
                            //-i video.webm -movflags faststart -profile:v high -level 4.2 video.mp4
                           // -i video.webm -preset veryfast video.mp4
                           //"-i untitle.webm -movflags faststart -profile:v high -level 4.2 untitle.mp4"
                           //-i untitle.webm -c:v copy untitle.mp4
                           //"-i untitle.webm --movflags faststart untitle.mp4".split(" "),
                             arguments: "-i untitle.webm -c:v mpeg4 -b:v 6400k -strict experimental output.mp4".split(" "),
                            files: [
                                {
                                    data: new Uint8Array(aab),
                                    name: "untitle.webm"
                                }
                            ]
                        });
                    };
                }

                function PostBlob(blob) {
                    console.log(blob)
                    var video = document.createElement('video');
                    video.controls = true;
                    video.src = URL.createObjectURL(blob);
                    video.type = 'video/mp4'
                    document.body.appendChild(video);

                   
                    document.body.appendChild(document.createElement('hr'));
                    var h2 = document.createElement('h2');
                    //h2.innerHTML = '<a href="' + source.src + '" target="_blank" download="Play mp4 in VLC Player.mp4" style="font-size:200%;color:red;">Download Converted mp4 and play in VLC player!</a>';
                    document.body.appendChild(h2);
                    h2.style.display = 'block';
                    video.tabIndex = 0;
                    video.focus();
                    video.play();

                    //document.querySelector('#record-video').disabled = false;
                }
function stop_video(){
    URL.revokeObjectURL(previous_URL);
    video_recording.stop();
    /*

    immediately stop video access of camera and microphone (any active mediastrema)

    */
    stream.getTracks().forEach(tracker=>{
        tracker.stop();
    })

   

}

function take_screen_shot(){

  const canvas = document.createElement('canvas')
  canvas.width = 640;
  canvas.height  =480;
  const context = canvas.getContext('2d')
  context.drawImage(video,0,0,canvas.width,canvas.height)
  const dataURL = canvas.toDataURL('image/jpg');
  console.console.log
(dataURL)
   const a = document.createElement('a')
     a.download  = 'videosksk.jpg';
     a.href = dataURL
     a.textContent = a.download;
     document.body.appendChild(a)

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
    cursor: is_display_cursor
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

function create_video(src,download_name){
  const video = document.createElement("video");
  previous_URL = URL.createObjectURL(src)

  video.setAttribute("controlsList", "nodownload");
  video.src = previous_URL;
  video.download = 'untitle.webm'
  //set controls property for video which makes user able to control the video element
  video.setAttribute('controls','controls')
  video.disablePictureInPicture = true
  document.body.appendChild(video);

  create_download_URL(previous_URL,download_name)
}

function create_download_URL(url,download_name){
const a = document.createElement('a')
  a.download  = download_name;
  a.href = previous_URL
  a.textContent = a.download;

  document.body.appendChild(a)

}

function check_user_broswer(){
/*

!! is just to do a boolean check 

!!condition is equivalent to Boolean (condition)

 */

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
