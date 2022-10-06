const {
  app,

  Menu,
} = require("electron");

initializeMenu = (browserWindow) => {
  const dockMenu = Menu.buildFromTemplate([
    {
      label: "Set Window Size",

      submenu: [
        {
          label: "Small",
          click: () => {
            console.log("small");
            browserWindow.setSize(500, 300);
          },
        },
        {
          label: "Medium",
          click: () => {
            browserWindow.setSize(800, 600);
          },
        },
        {
          label: "Large",
          click: () => {
            browserWindow.setSize(1200, 800);
          },
        },
      ],
    },
  ]);
  if (process.platform === "darwin") {
    app.dock.setMenu(dockMenu);
  }
};

module.exports = {
  initializeMenu,
};
