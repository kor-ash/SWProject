const { app, BrowserWindow, Menu } = require('electron')
// include the Node.js 'path' module at the top of your file 
const path = require('path')
// modify your existing createWindow() function 
function createWindow() {
    const template = [
        {
            label: "File",
            submenu: [
                {
                    label: "Open",

                    click: () => {
                        console.log("hl");
                    },
                },
                {
                    role: 'toggleDevTools',
                }
            ]
        }
        , {
            label: "File1",
            submenu: [
                {
                    label: "Ope1n"
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    const win = new BrowserWindow({
        width: 1500,
        height: 1500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadURL('http://localhost:3000')
}
app.whenReady().then(() => {
    createWindow()
})