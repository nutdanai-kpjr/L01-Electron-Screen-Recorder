const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  showItemInFolder: (filePath) =>
    ipcRenderer.invoke("SHOW_ITEM_IN_FOLDERS", filePath),
  setStatus: (isRecording) => ipcRenderer.invoke("SET_STATUS", isRecording),
  getWindows: () => ipcRenderer.invoke("GET_WINDOWS"),
  onSelectWindow: (callback) => ipcRenderer.on("SELECT_WINDOW", callback),
  handlePreviewAvaliable: (blobEvent) => {
    ipcRenderer.send("PREVIEW_AVAILABLE", blobEvent);
  },
  printTitle: (data) => {
    console.log("at preload");
    console.log(data);
    ipcRenderer.send("print-title", data);
  },
  stopPreview: (recordedChunks) =>
    ipcRenderer.invoke("STOP_PREVIEW", recordedChunks),
});
