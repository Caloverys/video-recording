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
