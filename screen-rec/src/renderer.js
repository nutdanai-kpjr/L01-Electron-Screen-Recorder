const { writeFile } = require("fs");
const { ipcRenderer, shell } = require("electron");
const desktopCapturer = {
  getSources: (opts) =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", opts),
};
const dock = {
  setBadge: (isRecording) => ipcRenderer.invoke("SET_DAVIN_BADGE", isRecording),
};
const remote = require("@electron/remote");
const { dialog, Menu } = remote;

const selectWindowBtn = document.getElementById("select-window-btn");
const vidHTMLelement = document.querySelector("video");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const speakerText = document.getElementById("speaker");

///

const getWindows = async () => {
  // get avaliable window
  const inputWindows = await desktopCapturer.getSources({
    types: ["window", "screen"],
  });
  // display them in menu
  const windowSelectionMenu = Menu.buildFromTemplate(
    inputWindows.map((window) => {
      return {
        label: window.name,
        click: () => selectWindow(window),
      };
    })
  );

  windowSelectionMenu.popup();
};
selectWindowBtn.onclick = getWindows;
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
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: "Save video",
    defaultPath: `vid-${Date.now()}.webm`,
  });

  if (filePath) writeFile(filePath, buffer, () => showRecordingSaved(filePath));
};
// after we select video , we will display it in preview
const selectWindow = async (window) => {
  selectWindowBtn.innerText = "🎤 " + window.name;
  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: window.id,
      },
    },
  };
  const vidStreams = await navigator.mediaDevices.getUserMedia(constraints);
  speakerText.innerText = "";
  vidHTMLelement.srcObject = vidStreams;
  vidHTMLelement.play();

  const vidOptions = { mimeType: "video/webm; codecs=vp9" };
  vidRecorder = new MediaRecorder(vidStreams, vidOptions);

  // Then set condition if video is avaialble, display it
  vidRecorder.ondataavailable = handlePreviewAvaliable;
  vidRecorder.onstop = handleStopPreview;
};

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
  dock.setBadge(isRecording);
  showRecordingStartNotification(selectWindowBtn.innerText);
};
const stop = () => {
  if (!vidRecorder) return;
  vidRecorder.stop();
  startBtn.innerText = "🟢 Start";

  isRecording = false;
  dock.setBadge(isRecording);
};
startBtn.onclick = (e) => {
  start();
};

stopBtn.onclick = (e) => {
  stop();
};

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
    shell.showItemInFolder(filePath);
  };
};
