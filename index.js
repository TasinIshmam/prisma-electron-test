console.log("Renderer called")

const electron = require("electron")
const ipc = electron.ipcRenderer


const prismaBtn = document.getElementById("prismaBtn")
const createBtn = document.getElementById("createBtn")

createBtn.addEventListener('click', async () => {
    ipc.send('prisma-create-user')
})

prismaBtn.addEventListener('click', async () => {
    ipc.send('prisma-button-request')
})

ipc.on("prisma-button-response", async function (event, args) {
    console.log(args)
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
      }
      replaceText(`user-data`, args)
})
