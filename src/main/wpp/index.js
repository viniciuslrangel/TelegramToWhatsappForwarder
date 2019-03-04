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
    this._loadCallback = () => {
      this._js(`
      const eventFire = (el, etype) => {
        const evt = document.createEvent('MouseEvents')
        evt.initMouseEvent(etype, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        el.dispatchEvent(evt)
      }
      document.addEventListener("keydown", function (e) {
        if (e.which === 123) {
          require('electron').ipcRenderer.send('Whatsapp/TOOGLE_VISIBILITY')
        }
      })
      `)
    }
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
      const oldCallback = this._loadCallback
      this._loadCallback = () => {
        oldCallback()
        callback()
      }
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

  selectChat(title) {
    return this._js(`
      (() => {
        try {
          const sidePane = document.getElementById('pane-side')
          side.scrollTop = 0
          let last = -1
          while(side.scrollTop != last) {
            for (e of Array.from(sidePane.firstChild.firstChild.firstChild.children)) {
              if (e.innerText.split('\\n')[0] === '${title.replace(/'/g, "\\'")}') {
                eventFire(e.firstChild.firstChild, 'mousedown')
                return true
              }
            }
            last = side.scrollTop
            side.scrollTop += side.offsetHeight
          }
        } catch(e) {
          return e
        }
        return false
      })()
    `)
  }

  sendMessage(msg) {
    return this._js(`
      (() => {
        const el = document.querySelector('div.copyable-text.selectable-text[contenteditable=true]')
        el.innerText = '${msg.replace(/'/g, "\\'")}'
        const event = document.createEvent('UIEvents')
        event.initUIEvent('input', true, true, window, 1)
        el.dispatchEvent(event)
        eventFire(document.querySelector('button > span[data-icon="send"]').parentElement, 'click')
      })()
    `)
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
        new Promise((resolve) => {
          let i = setInterval(() => {
                try {
                    let el = document.querySelector("#window .window-body .window-text .action")
                    if (el != null) {
                      resolve(false)
                      clearInterval(i)
                      return
                    }
                    el = document.querySelector('div[data-ref] > span ~ canvas')
                    if (el != null) {
                      resolve(true)
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
    return this._js(`
      Array.from(document.getElementById('pane-side').firstChild.firstChild.firstChild.children)
        .map(e => e.innerText.split('\\n')[0])
    `)
  }
}

export function setMainApp(app) {
  mainApp = app
}
