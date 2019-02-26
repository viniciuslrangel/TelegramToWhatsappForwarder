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

  async isLogged() {
    await this.waitReady()
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

  async waitLogin() {
    return new Promise((resolve) => {
      const i = setInterval(async () => {
        if (await this.isLogged()) {
          clearInterval(i)
          resolve()
        }
      }, 300)
    })
  }

  waitReady() {
    return new Promise((resolve) => {
      this._js(`
        new Promise((resolve, reject) => {
          let i = setInterval(() => {
                try {
                    let el = document.querySelector("#window .window-body .window-text .action")
                    if (el != null) {
                      resolve(false)
                      clearInterval(i)
                      return
                    }
                    el = document.querySelector("div[data-animate-modal-popup=true]")
                    if (el != null) {
                        el.firstChild.children[1].children[1].click()
                        return
                    }
                    el = document.getElementById('pane-side')
                    if (el == null) {
                        return
                    }
                    clearInterval(i)
                    resolve(true)
                } catch(e) {}
          }, 300)
        })
      `).then((e) => {
        if (e) {
          resolve()
        } else {
          this.win.webContents.session.clearStorageData({
            storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage']
          }, () => {
            this.win.reload()
            this.waitReady().then(() => resolve())
          })
        }
      })
    })
  }

  async listUsers() {
    await this.waitReady()
    /* eslint-disable no-useless-escape */
    return this._js(`
      Array.from(document.getElementById('pane-side').firstChild.firstChild.firstChild.children)
        .sort((a, b) => a.style.transform.match(/\\d/)[0] - b.style.transform.match(/\\d/)[0])
        .map(e => e.firstChild.firstChild.children[1].firstChild.firstChild.innerText.slice(0, -1))
    `)
    /* eslint-enable no-useless-escape */
  }
}

export function setMainApp(app) {
  mainApp = app
}
