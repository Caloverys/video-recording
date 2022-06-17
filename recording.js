<!DOCTYPE html>

<html lang="en">
<meta charset="UTF-8">

<head>

<style>
  body{
    overflow: scroll;
  }
</style>

</head>

<body>
  <video></video>
  <i class="fas fa-expand"></i>
  <script src='https://kit.fontawesome.com/44f674442e.js'></script>
  <button id='record_button'>Record</button>
  <button id='toggle_button'>Full screen</button>
  <button onclick='take_screen_shot()'>Take</button>
<script type="text/javascript">
  let constraints;
  let stream;
  const record_button = document.querySelector('#record_button');
  const toggle_button = document.querySelector('i.fas.fa-expand');
  console.log(toggle_button)
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
     console.log(data)
     console.log(event)
     const a = document.createElement('a')
     a.download  = 'videosksk.webm';
     a.href = URL.createObjectURL(event.data)
     a.textContent = a.download;
     document.body.appendChild(a)
     const video = document.createElement('video')
     video.src = URL.createObjectURL(event.data);
     console.log( URL.createObjectURL(event.data))
     toggle_button.onclick = ()=>{togglescreen(video)}
     //set controls property for video which makes user able to control the video element
     video.setAttribute('controls','controls')
     document.body.appendChild(video)
   } 
   recording.start();
   console.log(recording,recording.state)
   setTimeout(()=>recording.stop(),2000)
  
}

function take_screen_shot(){
  const canvas = document.createElement('canvas')
  canvas.width = 640;
  canvas.height  =480;
  const context = canvas.getContext('2d')
  context.drawImage(video,0,0,canvas.width,canvas.height)
    canvas.toBlob(function(blob){
    var form = new FormData(),
     request = new XMLHttpRequest();

    form.append("image", blob, "filename.png");
    request.open("POST", "/upload", true);
    request.send(form);
}, "image/png");
  const dataURL = canvas.toDataURL('image/jpg')
  console.log(dataURL)
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
</script>  
</body>
