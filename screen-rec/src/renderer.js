const selectWindowBtn = document.getElementById("select-window-btn");
const vidHTMLelement = document.querySelector("video");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const speakerText = document.getElementById("speaker");

///

let vidRecorder;
const recordedChunks = [];
// use navigator.mediaDevices.getUserMedia
const handlePreviewAvaliable = (e) => {
  recordedChunks.push(e.data);
};

const handleStopPreview = async (e) => {
  const vidBlob = new Blob(recordedChunks, {
    type: "video/webm; codecs=vp9",
  });
  const buffer = Buffer.from(await vidBlob.arrayBuffer());
  const filePath = window.api.saveFile(buffer);
  if (filePath) showRecordingSaved(filePath);
};
// after we select video , we will display it in preview
const selectWindow = async (windowId, windowName) => {
  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: windowId,
      },
    },
  };
  const vidStreams = await navigator.mediaDevices.getUserMedia(constraints);
  const vidOptions = { mimeType: "video/webm; codecs=vp9" };
  vidRecorder = new MediaRecorder(vidStreams, vidOptions);

  selectWindowBtn.innerText = "🎤 " + windowName;
  speakerText.innerText = "";
  vidHTMLelement.srcObject = vidStreams;
  vidHTMLelement.play();
  // Then set condition if video is avaialble, display it
  vidRecorder.ondataavailable = handlePreviewAvaliable;
  vidRecorder.onstop = handleStopPreview;
};

window.api.onSelectWindow((e, windowId, windowName) => {
  selectWindow(windowId, windowName);
});

let isRecording = false;
// record and save vid file
const start = () => {
  if (!vidRecorder) {
    speakerText.innerText = "Please select a window first!";
    return;
  }
  speakerText.innerText = "";
  vidRecorder.start();
  startBtn.innerText = "🟡 Recording";
  isRecording = true;
  window.api.setStatus(isRecording);
  showRecordingStartNotification(selectWindowBtn.innerText);
};
const stop = () => {
  if (!vidRecorder) return;
  vidRecorder.stop();
  startBtn.innerText = "🟢 Start";

  isRecording = false;
  window.api.setStatus(isRecording);
};
startBtn.onclick = (e) => {
  start();
};

stopBtn.onclick = (e) => {
  stop();
};

const getWindows = async () => {
  await window.api.getWindows();
};
selectWindowBtn.onclick = getWindows;
//  shortcut
// F9 for recording

const handleKeyPress = (e) => {
  if (e.key !== "F9") return;
  // You can put code here to handle the keypress.
  // document.getElementById("last-keypress").innerText = e.key;
  if (isRecording) {
    stop();
  } else {
    start();
  }
};
window.addEventListener("keyup", handleKeyPress, true);

const showRecordingStartNotification = (name) => {
  new Notification("Recording Start", { body: "on window: " + name });
};
const showRecordingSaved = (filePath) => {
  new Notification("Record Saved!", {
    body: "Click to open directory",
  }).onclick = (e) => {
    window.api.showItemInFolder(filePath);
  };
};
