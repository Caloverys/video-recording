  
   let stream,previous_URL,strem;
   const video_container = document.querySelector('#video_container')
  const record_button = document.querySelector('#record_button');
  const parent_of_record_button = document.querySelector('#container_of_record_button')
  const toggle_button = document.querySelector('i.fas.fa-expand');
  const screen_capture_button = document.querySelector('#screen_capture_button')
  const full_screen_button = document.querySelector('#full_screen_button')
  const cursor_checkbox = document.querySelector('#cursor_checkbox');
  const setting_button = document.querySelector('#setting_button')
  const screen_shot_button = document.querySelector('#screenshot_button')
 const tooltip = document.querySelector('.tooltip')
   //the default value for displaying cursor is always 
  let is_display_cursor = "always";
let tooltip_visible = false
setting_button.addEventListener('mouseover',function(){
    setting_button.style.transform = "rotate(60deg)";
    setting_button.style.transition = 'transform 0.3s'
})
setting_button.addEventListener('mouseout',function(){
    setting_button.style.transform = "rotate(0deg)";
    setting_button.style.transition = 'transform 0.3s'
})
setting_button.addEventListener('click',function(){
    console.log('what')
    if(!tooltip_visible){
    tooltip.style.visibility = 'visible'
    tooltip.querySelector('button').style.visibility = 'visible'
    tooltip_visible = true;
    document.addEventListener("click",check_tool_tip);
 }else{
     tooltip.style.visibility = 'hidden'
     //button has transition so we need to separetly immediately hide them
         tooltip.querySelector('button').style.visibility = 'hidden'
    tooltip_visible = false;
    document.removeEventListener("click",check_tool_tip)
 }
})
function check_tool_tip(event){
    if(tooltip_visible && event.target.id !== "setting_button" ){
    tooltip.style.visibility = 'hidden'
    tooltip.querySelector('button').style.visibility = 'hidden'
    } 
}
 let video_recording;

  const preview_video = document.querySelector('#preview')

tooltip.querySelector('#microphone > button').addEventListener('click',function(event){
    const i_icon = document.querySelector('#microphone i')

    if(i_icon.classList.contains('button_active')) audio_on = false
    else audio_on = true

    i_icon.classList.toggle('button_active')
})

tooltip.querySelector('#mirror_mode > button').addEventListener('click',function(event){

    const i_icon = document.querySelector('#mirror_mode i')

    if(i_icon.classList.contains('button_active'))
        preview_video.style.transform = 'initial'

    else
       preview_video.style.transform = 'scaleX(-1)'
    
    i_icon.classList.toggle('button_active')
})
let audio_on = true
/* 
ask for user permissin first to prevent future asking 
*/
window.addEventListener('DOMContentLoaded', () => {
    navigator.mediaDevices.getUserMedia({
      audio:true,
      video:true,
    }).then(media =>{
        media.getTracks().forEach(device =>{

            if(device.kind === 'audio') document.querySelector('#microphone li').textContent = device.label;
            else document.querySelector('#camera li').textContent = device.label;

        })
    })
    const script = document.createElement('script')
    script.src = 'https://kit.fontawesome.com/44f674442e.js'
    script.onload = ()=>{
        screen_capture_button.style.visibility = 'visible';
        toggle_button.style.visibility = 'visible'
    
    }
});


cursor_checkbox.addEventListener('click',function(){
  if(cursor_checkbox.checked) is_display_cursor = "always"
    else is_display_cursor = 'none'
})

document.addEventListener('fullscreenchange', change_screen_event, false);
 document.addEventListener('mozfullscreenchange', change_screen_event, false);
 document.addEventListener('MSFullscreenChange', change_screen_event, false);
 document.addEventListener('webkitfullscreenchange', change_screen_event, false);



let in_full_screen = false
full_screen_button.addEventListener('click',function(){
    change_screen_event()
    togglescreen(video_container);

    if(in_full_screen) in_full_screen = false

})

function change_screen_event(){
    const root = document.querySelector(':root')
    if(!in_full_screen){
       
        root.style.setProperty("--width",'100vw')
        root.style.setProperty("--height","100vh")
        full_screen_button.classList.add('full_screen_button_full_screen')
        screen_shot_button.classList.add('screenshot_button_full_screen')
        setting_button.classList.add("setting_button_full_screen")
        //full_screen_button.style.right = '5vw'
        in_full_screen = true
    }else{
         root.style.setProperty("--width","654px")

        root.style.setProperty("--height","500px")
        in_full_screen = false
        full_screen_button.classList.remove('full_screen_button_full_screen')
        screen_shot_button.classList.remove('screenshot_button_full_screen')
        setting_button.classList.remove("setting_button_full_screen")
    }
}
window.addEventListener('load',function(){
navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 1200, height: 720 } })
.then(function(mediaStream) {

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
    if(!record_button.classList.contains('active')){
        record_button.classList.add('active');
        start_video();
    }else{
        record_button.classList.remove('active')
        stop_video();
    }
})

function start_video(){
    console.log(audio_on)
    navigator.mediaDevices.getUserMedia({ audio: audio_on, video: { width: 1200, height: 720 } })
    .then(stream =>{
    video_recording = new MediaRecorder(stream,{
    mimeType: "video/webm"
})
      let data = [];
  video_recording.ondataavailable = event =>{
    data.push(event.data)
    create_video(event.data, "untitle.webm")

    convertStreams(new Blob([event.data], {
    type: "video/x-matroska;codecs=avc1"
}))
    console.log(new Blob([event.data], {
    type: "video/x-matroska;codecs=avc1"
}))
}
 video_recording.start();
  })
   
 
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

















