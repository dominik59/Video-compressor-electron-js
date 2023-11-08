const { app, BrowserWindow, dialog } = require('electron')
const ffmpeg = require('fluent-ffmpeg')
const { ipcMain } = require('electron');


let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    title: 'Video Compressor',
    width: 400,
    height: 250,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  ipcMain.on('fileDropped', (event, filePath) => {
    compressVideo(filePath)
  });
})

function compressVideo(filePath) {
  ffmpeg(filePath)
    .outputOptions('-r', '24')
    .outputOptions('-b:v', '100k')
    .on('end', () => {
      dialog.showMessageBox({
        message: 'Video compression completed!'
      })
    })
    .on('error', (err) => {
      console.log('An error occurred: ' + err.message)
    })
    .save(filePath.replace(/\.[^/.]+$/, '') + '_compressed.mp4')
}