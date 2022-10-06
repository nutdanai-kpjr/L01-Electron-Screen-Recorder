const {
  ipcMain,
  desktopCapturer,
  app,
  dialog,
  Menu,
  webContents,
  BrowserWindow,
  shell,
} = require("electron");

const { writeFile } = require("fs");

const initializeIPCMAIN = () => {
  ipcMain.handle("SAVE_FILE", async (e, buffer) => {
    const { filePath } = await dialog.showSaveDialog(
      BrowserWindow.fromId(e.sender.id),
      {
        title: "HELLO SAVE",
        buttonLabel: "Save video",
        defaultPath: `vid-${Date.now()}.webm`,
      }
    );

    if (filePath) writeFile(filePath, buffer, () => {});
    return filePath;
  });
  ipcMain.handle("SET_STATUS", (e, isRecording) => {
    if (process.platform === "darwin") {
      const badge = isRecording ? "🟡" : "";
      app.dock.setBadge(`${badge}`);
    }
    if (process.platform === "win32") {
    }
    if (process.platform === "linux") {
    }
  });

  ipcMain.handle("GET_WINDOWS", async (e) => {
    // get avaliable window
    const inputWindows = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });

    const win = webContents.fromId(e.sender.id);

    const windowSelectionMenu = Menu.buildFromTemplate(
      inputWindows.map((window) => {
        return {
          label: window.name,
          click: () => {
            win.send("SELECT_WINDOW", window.id, window.name);
          },
        };
      })
    );
    windowSelectionMenu.popup();
  });
  // display them in menu
  //   const windowSelectionMenu = Menu.buildFromTemplate(
  //     inputWindows.map((window) => {
  //       return {
  //         label: window.name,
  //         //   click: () => onSelectWindow(window),
  //       };
  //     })
  //   );

  ipcMain.handle("SHOW_ITEM_IN_FOLDERS", async (e, filePath) => {
    shell.showItemInFolder(filePath);
  });
};

module.exports = initializeIPCMAIN;
