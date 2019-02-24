import { ipcMain } from 'electron' // eslint-disable-line
import store from '../../renderer/store'
import TelegramClient, { STATUS } from '.'

let client

function refreshChat() {
  if (client == null) {
    return
  }
  client.getChats().then((c) => {
    store.dispatch('Telegram/setPhoneList', c)
  })
}

function updateClient() {
  // eslint-disable-next-line prefer-destructuring
  const phone = store.state.Telegram.phone
  if (client != null) {
    client.destroy()
    client = null
  }
  if (phone == null) {
    store.dispatch('Telegram/updateState', {
      state: STATUS.WAITING_LOGIN
    })
    return
  }
  client = new TelegramClient(phone.replace(/[^\d]/g, ''))
  client.stateCallback = (state, payload) => {
    store.dispatch('Telegram/updateState', {
      state,
      payload
    })
  }
  client.client.ready.then(refreshChat)
}

store.subscribe((mutation) => {
  if (mutation.type === 'Telegram/UPDATE_PHONE') {
    updateClient()
  }
})

ipcMain.on('Telegram/CREATE', () => {
  updateClient()
})

ipcMain.on('Telegram/CODE', (event, arg) => {
  if (client != null) {
    client.sendAuthCode(arg)
  }
})

ipcMain.on('Telegram/PASSWD', (event, arg) => {
  if (client != null) {
    client.sendPasswordCode(arg)
  }
})
