   let constraints,stream,previous_URL,strem;
  const record_button = document.querySelector('#record_button');
  const parent_of_record_button = document.querySelector('#container_of_record_button')
  const toggle_button = document.querySelector('i.fas.fa-expand');
  const screen_capture_button = document.querySelector('#screen_capture_button')
  const cursor_checkbox = document.querySelector('#cursor_checkbox')
   //the default value for displaying cursor is always 
  let is_display_cursor = "always"
 constraints = { audio: false, video: { width: 1200, height: 720 } };

 const microphone_button = document.querySelector('#microphone > button')
 let video_recording;

  const preview_video = document.querySelector('#preview')



microphone_button.addEventListener('click',function(){
    const i_icon = microphone_button.querySelector('i')
    if(i_icon.classList.contains('button_active'))
        i_icon.classList.remove('button_active')
    else i_icon.classList.add('button_active')
})
/* 
ask for user permissin first to prevent future asking 

*/
/*window.addEventListener('DOMContentLoaded', () => {
    navigator.mediaDevices.getUserMedia({
      audio:true,
      video:true,
    });
    const script = document.createElement('script')
    script.src = 'https://kit.fontawesome.com/44f674442e.js'
    script.onload =>{
        screen_capture_button.style.visibility = 'visible';
        toggle_button.style.visibility = 'visible'
    
    }
});*/


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

  preview_video.srcObject = mediaStream; 
  preview_video.onloadedmetadata = function(e) {
    preview_video.play();
  };

})
})

screen_capture_button.addEventListener('click',function(){
    take_screen_shot()
})
parent_of_record_button.addEventListener('click',function(){
    console.log('what')
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


                function assign_worker(){
                    const script =  URL.createObjectURL(new Blob([document.querySelector('#convert_webm_to_mp4_worker').textContent]));
                    const worker = new Worker(script);
                    window.URL.revokeObjectURL(script);
                    return worker;
                }

                function convertStreams(videoBlob) {
                   let data,buffersReady;
                    const fileReader = new FileReader();
                    fileReader.onload = function() {
                        data = this.result;
                        post_message()
                    };
                     fileReader.readAsArrayBuffer(videoBlob);

                    const my_worker  = assign_worker() 

                    
                    my_worker.onmessage = function(event) {
                    if (event.data.type == "ready") {
                            if (buffersReady) post_message();
                        } 
                       else if (event.data.type == "done") {
                            const result = event.data.data[0];
                            const blob = new Blob([result.data],{type: 'video/mp4'});
                            create_video(blob,"untitle.mp4");
                            //terminate web worker after the mp4 loaded
                            my_worker.terminate();
                        }
                    };


                    function post_message(){
                        my_worker.postMessage({
                            type: 'command',
                            //-i video.webm -movflags faststart -profile:v high -level 4.2 video.mp4
                           // -i video.webm -preset veryfast video.mp4
                           //"-i untitle.webm -movflags faststart -profile:v high -level 4.2 untitle.mp4"
                           //-i untitle.webm -c:v copy untitle.mp4
                           //"-i untitle.webm --movflags faststart untitle.mp4".split(" "),
                             arguments: "-i untitle.webm -c:v mpeg4 -b:v 6400k -strict experimental output.mp4".split(" "),
                            files: [
                                {
                                    data: new Uint8Array(data),
                                    name: "untitle.webm"
                                }
                            ]
                        })
                    }
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
  console.log(src)
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
