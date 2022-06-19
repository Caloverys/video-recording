  
   let stream,previous_URL,strem;
   const video_container = document.querySelector('#video_container')
  const record_button = document.querySelector('#record_button');
  const parent_of_record_button = document.querySelector('#container_of_record_button')
  const toggle_button = document.querySelector('i.fas.fa-expand');
  const full_screen_button = document.querySelector('#full_screen_button')
  const cursor_checkbox = document.querySelector('#cursor_checkbox');
  const setting_button = document.querySelector('#setting_button')
  const button_container = document.querySelector('#button_container')
    const delete_button = document.querySelector('#delete_button');
  const trash_button = document.querySelector('#trash_button');
 const tooltip = document.querySelector('.tooltip')
 const screen_shot_button = document.querySelector('#screenshot_button')
 const screen_capture_button  = document.querySelector('#mode_change_button')
 const download_button = document.querySelector('#download_button')
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

    if(!tooltip_visible){
    tooltip.style.visibility = 'visible'
    tooltip.querySelector('button').style.visibility = 'visible'
    tooltip_visible = true;
 }else{
     tooltip.style.visibility = 'hidden'
     //button has transition so we need to separetly immediately hide them
         tooltip.querySelector('button').style.visibility = 'hidden'
    tooltip_visible = false;
    //document.removeEventListener("click",check_tool_tip)
 }
})

screen_shot_button.addEventListener('click',function(){
take_screen_shot()
})



 let video_recording;

  let preview_video = document.querySelector('#preview')

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

/*cursor_checkbox.addEventListener('click',function(){
  if(cursor_checkbox.checked) is_display_cursor = "always"
    else is_display_cursor = 'none'
})
*/
document.addEventListener('fullscreenchange', leave, false);
 document.addEventListener('mozfullscreenchange',leave, false);
 document.addEventListener('MSFullscreenChange', leave, false);
 document.addEventListener('webkitfullscreenchange', leave, false);



let turn_full_screen = false;
full_screen_button.addEventListener('click',function(){
    change_screen_event()
    turn_full_screen = true
    togglescreen(video_container);
    
})
function change_screen_event(){
    const root = document.querySelector(':root')
    if(!document.fullscreenElement){
        screen_shot_button.style.display = 'none'
       
        root.style.setProperty("--width",'100vw')
        root.style.setProperty("--height","100vh")
        full_screen_button.classList.add('full_screen_button_full_screen')
        setting_button.classList.add("setting_button_full_screen")
        tooltip.classList.add('tooltip_full_screen')

    }else{
         screen_shot_button.style.display = 'revert'
         root.style.setProperty("--width","800px")
        root.style.setProperty("--height","575px")
        full_screen_button.classList.remove('full_screen_button_full_screen')

        setting_button.classList.remove("setting_button_full_screen");
        tooltip.classList.remove("tooltip_full_screen")
    }
}

function leave(){
    if(turn_full_screen) {
        turn_full_screen = false
        return
    }
    screen_shot_button.style.display = 'revert'
      const root = document.querySelector(':root');
       root.style.setProperty("--width","1000px")

        root.style.setProperty("--height","650px")
        in_full_screen = false
        full_screen_button.classList.remove('full_screen_button_full_screen')
        screen_shot_button.classList.remove('screenshot_button_full_screen')
        setting_button.classList.remove("setting_button_full_screen");
}
window.addEventListener('load',load_preview)

function load_preview(){
navigator.mediaDevices.getUserMedia({ audio: false, video: {width: { ideal: 4096 },
        height: { ideal: 2160 }  }})
.then(function(mediaStream) {

  stream = mediaStream;

  preview_video.srcObject = mediaStream; 
  preview_video.onloadedmetadata = function(e) {
    preview_video.play();
  };
})
}
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
    navigator.mediaDevices.getUserMedia({ audio: audio_on, video:{width: { ideal: 4096 },
        height: { ideal: 2160 }  }})
    .then(stream =>{
    video_recording = new MediaRecorder(stream,{
    mimeType: "video/webm"
})
      let data = [];
  video_recording.ondataavailable = event =>{
    data.push(event.data)


  previous_URL = URL.createObjectURL(event.data)
  //console.log(src)
  preview_video.outerHTML = '<video id="preview"></video>'
  preview_video = document.querySelector("#preview")
  preview_video.setAttribute("controlsList", "nodownload");
  preview_video.src = URL.createObjectURL(event.data);
  preview_video.download = 'untitle.webm'
  //set controls property for video which makes user able to control the video element
  preview_video.setAttribute('controls','controls')
  preview_video.disablePictureInPicture = true
  hide_all_buttons()
   trash_button.style.display = 'revert'
   delete_button.style.display = 'revert'
   download_button.style.display  ='flex';
   download_button.href = URL.createObjectURL(event.data);
   download_button.download = 'video.webm'
   trash_button.addEventListener('click',remove)
   delete_button.addEventListener('click',remove)
   function remove(){
    download_button.style.display = 'none'
    button_container.querySelectorAll('button').forEach(button =>button.style.display = 'revert');
    trash_button.removeEventListener('click',remove)
    delete_button.removeEventListener('click',remove)
    trash_button.style.display = 'none';
     setting_button.style.display = 'revert'
     full_screen_button.style.display ='revert'
    parent_of_record_button.style.display= 'flex'
     setting_button.style.display = 'revert'
     screen_shot_button.style.display = "revert"
     preview_video.removeAttribute("controls")
    load_preview();
   }
//create_video(event.data, "untitle.webm")

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
                            create_download_URL(blob,"untitle.mp4");
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
        preview_video.srcObject.removeTrack(tracker)
    })


}

function hide_all_buttons(){
    button_container.querySelectorAll('button').forEach(button =>button.style.display = 'none');
    delete_button.style.display = 'none';
    trash_button.style.display = 'none'
    download_button.style.display='none'
      screen_shot_button.style.display = 'none';
  setting_button.style.display = 'none'
  full_screen_button.style.display = 'none'
  parent_of_record_button.style.display = 'none'
}
function take_screen_shot(){

  const canvas = document.createElement('canvas')
  const {width,height} = preview_video.getBoundingClientRect()
  canvas.width = width;
  canvas.height  =height;
   button_container.style.display = 'none'
  const context = canvas.getContext('2d')
  context.drawImage(preview_video,0,0,width,height)
   button_container.style.display = 'revert'
  const dataURL = canvas.toDataURL('image/jpg');
  const img = document.createElement('img')
  img.src=dataURL
  video_container.appendChild(img)

  button_container.querySelectorAll('button').forEach(button =>button.style.display = 'none');
  delete_button.style.display ='revert';
  trash_button.style.display = 'revert';
  download_button.style.display = 'flex'

   trash_button.addEventListener('click',remove_image)
   delete_button.addEventListener('click',remove_image)

    download_button.download  = 'image.jpg';
     download_button.href = dataURL

   function remove_image(){
    button_container.querySelectorAll('button').forEach(button =>button.style.display = 'revert');
    trash_button.removeEventListener('click',remove_image)
    delete_button.removeEventListener('click',remove_image)
    img.remove();
  
    canvas.remove();
    download_button.href=""

    
   }
}


function togglescreen(elem){

  if((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)){
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
        if (document.cancelFullScreen){
           document.cancelFullScreen();
        }
        else if (document.mozCancelFullScreen){ /* Firefox */
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen){   /* Chrome, Safari and Opera */
            document.webkitCancelFullScreen();
        }
        else if (document.msExitFullscreen){ /* IE/Edge */
            document.msExitFullscreen();
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
















