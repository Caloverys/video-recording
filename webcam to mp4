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
