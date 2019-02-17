import { ipcMain } from 'electron' // eslint-disable-line
import store from '../../renderer/store'
import TelegramClient, { STATUS } from '.'

let client

function updateClient() {
  const { phone } = store.state.Telegram
  if (client != null) {
    client.destroy()
    client = null
  }
  if (phone == null) {
    store.dispatch('Telegram/updateState', { state: STATUS.WAITING_LOGIN })
    return
  }
  client = new TelegramClient(phone)
  client.setStateCallback((state) => {
    store.dispatch('Telegram/updateState', { state })
  })
}

export default () => {
  ipcMain.on('CREATE_CLIENT', updateClient)
  updateClient()
}
