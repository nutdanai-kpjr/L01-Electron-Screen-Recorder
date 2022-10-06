# LO1-ElectronScreenRecorder by Nash (6/OCT/2022)

🎤 Screen Recorder desktop app built via the electron.

This project is based on the Fireship [tutorial](https://www.youtube.com/watch?v=3yqDxhR2XxE) on electron.
I'm highly recommened this project as a starter for beginner, because you will learn many electron apis along the way E.g. screen capturing , file system, displaying native popup menu.  

In addition to the orginal version, to play with more electron apis, I also introduced notificaiton, shortcut intregration, macOS Dock configuration, as well as windowOS taskbar customization, these are the features in which I learned from [Examples in Electron docs](https://www.electronjs.org/docs/latest/tutorial/examples) (I'm highly recommend you to explore them!)

Lastly, due to the security changes in Electron,  they don't recommended us to give direct access to node api to renderers (nodeIntregration:true) given that the renderes source is remote-content. Due to this reason, I migrated from using node api directly in renderer.js to use them via IPC instead. Although I believed that my render is trusted source and enable nodeIntregration wouldn't do any harm here, I think it's great to learn the concept of [IPC](https://www.electronjs.org/docs/latest/tutorial/ipc) now for the sake of preparation for the real world project.


### Setup Guide

Install dependencies

```
cd screen-rec
npm install
```

Run the project

```
npm start
```


Packaging the project

```
npm run make
```

---


Thank you for reading to this far, I hope you enjoy it. If you have any question, please feel free to contact me via my email: nutdanai.kpjr@gmail.com
