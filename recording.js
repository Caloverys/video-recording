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
  <button id='record_button'>Record</button>
<script type="text/javascript">
  let constraints;
  let stream;
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
document.querySelector('button').addEventListener('click',function(){
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
   } 
   recording.start();
   console.log(recording,recording.state)
   setTimeout(()=>recording.stop(),10000)
  
}
