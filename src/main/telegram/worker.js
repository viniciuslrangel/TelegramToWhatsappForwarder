import { ipcMain } from 'electron' // eslint-disable-line
import store from '../../renderer/store'
import TelegramClient, { STATUS } from '.'

let client

function updateClient() {
  // eslint-disable-next-line prefer-destructuring
  const phone = store.state.Telegram.phone
  if (client != null) {
    client.destroy()
    client = null
  }
  if (phone == null) {
    store.dispatch('Telegram/updateState', { state: STATUS.WAITING_LOGIN })
    return
  }
  client = new TelegramClient(phone.replace(/[^\d]/g, ''))
  client.stateCallback = (state, payload) => {
    store.dispatch('Telegram/updateState', { state, payload })
  }
}

store.subscribe((mutation) => {
  if (mutation.type === 'Telegram/UPDATE_PHONE') {
    updateClient()
  } else if (mutation.type === 'Telegram/UPDATE_CODE') {
    if (client != null) {
      client.sendAuthCode(mutation.payload)
    }
  }
})

export default updateClient
