const { PrismaClient } = require('@prisma/client');
const { app, BrowserWindow } = require('electron')
const path = require('path')
let prisma = new PrismaClient();

const { ipcMain, dialog } = require('electron');
const { electron } = require('process');



ipcMain.on('prisma-create-user', async (event, arg) => {
    
    let count = await prisma.user.count({});
    await prisma.user.create({
        data: {
            email: `email-${count+1}`,
            name: `name-${count+1}`
        }
    });
    
})

ipcMain.on('prisma-button-request', async (event) => {
    console.log("Main Thread: Requesting all user data through IPC.")
    event.sender.send('prisma-button-response', JSON.stringify(await prisma.user.findMany({})))
})

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            // preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(async () => {
    console.log(await prisma.user.findMany({}))
    createWindow()



})

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', function () {
    console.log("Closing window")
    if (process.platform !== 'darwin') app.quit()
})