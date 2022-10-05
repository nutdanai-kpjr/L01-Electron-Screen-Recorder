const selectWindowBtn = document.getElementById("select-window");
const vidHTMLelement = document.querySelector("video");
selectWindowBtn.onclick = getWindows;

const { desktopCaputrer, remote } = require("electron");
const { Menu } = remote;
const getWindows = async () => {
  // get avaliable window
  const inputWindows = await desktopCaputrer.getSources({
    type: ["window", "screen"],
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

let vidRecorder;
const recordedChunks = [];
// use navigator.mediaDevices.getUserMedia

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
