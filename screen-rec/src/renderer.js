const selectWindowBtn = document.getElementById("select-window-btn");
const vidHTMLelement = document.querySelector("video");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const speakerText = document.getElementById("speaker");
const recordedChunks = []; // store video data
let vidRecorder; // video controller.
let isRecording = false;

/// USER INTERACTION
// 1. Select Window
// 2. Start Recording
// 3. Stop Recording

// 1.1 Get avaliable windows.
const getWindows = async () => {
  await window.api.getWindows();
};
selectWindowBtn.onclick = getWindows;

// 1.2 Define Select Window function to display video preview
const onSelectWindow = async (windowId, windowName) => {
  // use navigator.mediaDevices.getUserMedia
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

  vidRecorder.ondataavailable = hanldeOnVideoDataAvaliable; // Add video data to recordedChunks
  vidRecorder.onstop = handleStopRecord;
};
// Dropdown is managed by main.js , so we need set the onSelect behavior on preload api to connect this to main.
window.api.onSelectWindow((e, windowId, windowName) => {
  onSelectWindow(windowId, windowName);
});

// Store video data
const hanldeOnVideoDataAvaliable = (e) => {
  recordedChunks.push(e.data);
};
// Save video file
const handleStopRecord = async (e) => {
  filePath = await window.api.onStopRecord(recordedChunks);
  if (filePath) showRecordingSaved(filePath);
};

//  2. Start Recording
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
startBtn.onclick = (e) => {
  start();
};

// 3. Stop Recording
const stop = () => {
  if (!vidRecorder) return;
  vidRecorder.stop();
  startBtn.innerText = "🟢 Start";
  isRecording = false;
  window.api.setStatus(isRecording);
};
stopBtn.onclick = (e) => {
  stop();
};

// Shortcut
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

// Notifications
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
