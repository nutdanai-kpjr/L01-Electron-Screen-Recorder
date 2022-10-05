const { writeFile } = require("fs");
const { ipcRenderer } = require("electron");
const desktopCapturer = {
  getSources: (opts) =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", opts),
};
const remote = require("@electron/remote");
const { dialog, Menu } = remote;

const selectWindowBtn = document.getElementById("select-window-btn");
const vidHTMLelement = document.querySelector("video");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

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
        labels: window.name,
        clikc: () => selectWindow(window),
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
  await dialog.showSaveDialog({
    buttonLabel: "Save video",
    defaultPath: `vid-${Date.now()}.webm`,
  });
  writeFile(filePath, buffer);
};
// after we select video , we will display it in preview
const selectWindow = async (window) => {
  selectWindowBtn.innerText = window.name;
  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id,
      },
    },
  };
  const vidStreams = await navigator.mediaDevices.getUserMedia(constraints);

  vidHTMLelement.srcObject = vidStreams;
  vidHTMLelement.play();

  const vidOptions = { mimeType: "video/webm; codecs=vp9" };
  vidRecorder = new MediaRecorder(vidStreams, vidOptions);

  // Then set condition if video is avaialble, display it
  vidRecorder.ondataavailable = handlePreviewAvaliable;
  vidRecorder.onstop = handleStopPreview;
};

// record and save vid file

startBtn.onclick = (e) => {
  vidRecorder.start();
  startBtn.innerText = "🟡 Recording";
};

stopBtn.onclick = (e) => {
  vidRecorder.stop();
  startBtn.innerText = "🟢 Start";
};
