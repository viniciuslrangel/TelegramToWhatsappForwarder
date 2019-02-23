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

ipcMain.on('Whatsapp/CREATE', () => {
  updateClient()
})

