import { ipcMain } from 'electron' // eslint-disable-line
import store from '../../renderer/store'
import TelegramClient, { STATUS } from '.'
import * as wpp from '../wpp/worker'

let client

function refreshChat() {
  if (client == null) {
    return
  }
  client.getChats().then((c) => {
    store.dispatch('Telegram/setPhoneList', c)
  })
}

function newMessage(chatId, msg) {
  const { activeList, enableAll } = store.state.Telegram
  if (!enableAll && !activeList.some(e => e.id === chatId)) {
    return
  }
  const errList = wpp.sendMessage(msg)
  store.dispatch('Whatsapp/changeLastUserErrors', errList)
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
  client.setMessageCallback(newMessage)
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
