const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getWindows: () => ipcRenderer.invoke("GET_WINDOWS"),
  onSelectWindow: (callback) => ipcRenderer.on("SELECT_WINDOW", callback),

  setStatus: (isRecording) => ipcRenderer.invoke("SET_STATUS", isRecording),

  onStopRecord: async (recordedChunks) => {
    // define buffer here because renderer.js can't access it.
    const vidBlob = new Blob(recordedChunks, {
      type: "video/webm; codecs=vp9",
    });
    const buffer = Buffer.from(await vidBlob.arrayBuffer());
    return ipcRenderer.invoke("SAVE_FILE", buffer);
  },
  showItemInFolder: (filePath) =>
    ipcRenderer.invoke("SHOW_ITEM_IN_FOLDERS", filePath),
});
