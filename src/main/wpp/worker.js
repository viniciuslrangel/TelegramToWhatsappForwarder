import { ipcMain } from 'electron' // eslint-disable-line
import store from '../../renderer/store'
import WhatsAppClient from '.'

let client

// eslint-disable-next-line import/prefer-default-export
export { setMainApp } from '.'

function updateClient() {
  if (client != null) {
    client.destroy()
  }
  client = new WhatsAppClient()
  client.setLoadCallback(() => client.isLogged().then((value) => {
    if (value) {
      store.dispatch('Whatsapp/setLogged', true)
    } else {
      client.show()
      client.waitLogin().then(() => {
        client.hide()
        store.dispatch('Whatsapp/setLogged', true)
      })
      store.dispatch('Whatsapp/setLogged', false)
    }
  }))
}

ipcMain.on('Whatsapp/TOOGLE_VISIBILITY', () => {
  if (client == null) {
    return
  }
  if (client.win.isVisible()) {
    client.hide()
  } else {
    client.show()
    client.win.openDevTools()
  }
})

ipcMain.on('Whatsapp/CREATE', () => {
  updateClient()
})

ipcMain.on('Whatsapp/LIST_USERS', () => {
  if (client == null) {
    return
  }
  client.listUsers().then((r) => {
    store.dispatch('Whatsapp/setPhoneList', r)
  })
})

export async function sendMessage(msg) {
  const errs = []
  /* eslint-disable */
  for (const name of store.state.Whatsapp.activeList) {
    try {
      if(await client.selectChat(name) === true) {
        await client.sendMessage(msg)
      }
    } catch (e) {
      errs.push(name)
    }
  }
  /* eslint-enable */
  return errs
}

ipcMain.on('Whatsapp/SEND_MSG', (event, args) => {
  if (typeof args === 'string') {
    sendMessage(args)
  }
})
