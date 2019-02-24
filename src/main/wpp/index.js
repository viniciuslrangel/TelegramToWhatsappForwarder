import { BrowserWindow, session, ipcMain } from 'electron' // eslint-disable-line
// import store from '../../renderer/store'

let mainApp

export default class WhatsAppClient {
  constructor() {
    this.win = new BrowserWindow({
      parent: mainApp,
      modal: true,
      show: false,
      webPreferences: {
        images: false
      }
    })
    this._didLoad = false
    this._loadCallback = () => {}
    this.win.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36')
    this.win.webContents.setAudioMuted(true)
    this.win.webContents.on('did-finish-load', () => {
      this._loadCallback()
    })
    this.win.loadURL('https://web.whatsapp.com/')
  }

  _js(...args) {
    return this.win.webContents.executeJavaScript(...args)
  }

  setLoadCallback(callback) {
    if (this._didLoad) {
      callback()
    } else {
      this._loadCallback = callback
    }
  }

  destroy() {
    return this.win.destroy()
  }

  isLogged() {
    return new Promise(resolve => session.defaultSession.cookies.get({ domain: 'web.whatsapp.com' }, (err, cookies) => {
      resolve(cookies.length !== 0)
    }))
  }

  show() {
    this.win.show()
  }

  hide() {
    this.win.hide()
  }

  waitLogin() {
    return new Promise((resolve) => {
      const i = setInterval(async () => {
        if (await this.isLogged()) {
          clearInterval(i)
          resolve()
        }
      }, 300)
    })
  }
}

export function setMainApp(app) {
  mainApp = app
}
