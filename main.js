const { PrismaClient } = require('@prisma/client');
const { app, BrowserWindow } = require('electron')
const { join } = require('path');
const fs = require('fs')
const path = require('path')
const isDev = require('electron-is-dev');
const { ipcMain, dialog } = require('electron');
const { electron } = require('process');


const dbPath = isDev ? join(__dirname, './prisma/dev.db') : path.join(app.getPath("userData"), "database.db")

if (!isDev) {
    try {
        // database file does not exist, need to create
        fs.copyFileSync(join(process.resourcesPath, 'prisma/dev.db'), dbPath, fs.constants.COPYFILE_EXCL)
        console.log("New database file created")
    } catch (err) {
        if (err.code != "EEXIST") {
            console.error(`Failed creating sqlite file.`, err)
        } else {
            console.log("Database file detected")
        }
    }
}


let prisma = new PrismaClient({
    datasources: {
        db: {
            url: `file:${dbPath}`,
        },
    },
});


console.log(`Is Production?: ${!isDev}`)

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(async () => {
    createWindow()

})

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', function () {
    console.log("Closing window")
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('prisma-create-user', async (event, arg) => {
    console.log("Creating new user")
    let count = await prisma.user.count({});
    await prisma.user.create({
        data: {
            email: `email-${count + 1}`,
            name: `name-${count + 1}`
        }
    });

})

ipcMain.on('prisma-button-request', async (event) => {
    console.log("Main Thread: Requesting all user data through IPC.")
    event.sender.send('prisma-button-response', JSON.stringify(await prisma.user.findMany({})))
})
