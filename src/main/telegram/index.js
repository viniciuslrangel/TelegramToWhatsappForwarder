import {
  Client,
  Errors
} from 'tglib'
import fs from 'fs'
import path from 'path'

const api = {
  apiId: '736927',
  apiHash: 'd46fc613e06362d96df73308b4a6e7e4'
}

export const STATUS = Object.freeze({
  NONE: -1,
  WAITING_LOGIN: 0, // this is the default value
  WAITING_CODE: 1,
  WAITING_PASSWD: 2,
  LOGIN_SUCCESS: 3,
  ERROR: 4
})

export default class TelegramClient {
  /**
   * @param {string} phone Phone number
   */
  constructor(phone) {
    this.client = new Client({
      ...api,
      auth: {
        type: 'user',
        value: phone
      }
    })
    this.stateCallback = () => {}

    this.client.registerCallback('td:getInput', (...args) => this._getInput(...args))
    this.client.registerCallback('td:update', (...args) => this._update(...args))
    this.client.registerCallback('td:error', error => this._error(error))


    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      const updateCalback = this.client.callbacks['td:update'] || (() => {})
      this.client.registerCallback('td:update', (update) => { console.log('Telegram [Update]', update); updateCalback(update) })
      const errCalback = this.client.callbacks['td:error'] || (() => {})
      this.client.registerCallback('td:error', (error) => { console.error(error); errCalback(error) })
      /* eslint-enable no-console */
    }
    this.client.ready.then(() => this.stateCallback(STATUS.LOGIN_SUCCESS))
  }

  async _getInput({ type, string, extras: { hint } = {} }) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`Telegram [Input] (${type})${string}`)
    }
    if (type === 'input') {
      let status = null
      let msg
      switch (string) {
        case 'AuthorizationAuthCodeInput':
          status = STATUS.WAITING_CODE
          break
        case 'AuthorizationFirstNameInput':
          status = STATUS.ERROR
          msg = 'ACCOUNT NOT REGISTERED'
          break
        default:
          break
      }
      if (status !== null) {
        const p = new Promise((resolve) => {
          this._codeCallback = resolve
          this.stateCallback(status, msg)
        })
        return p
      }
    } else if (type === 'password') {
      let retry = false
      if (string === 'AuthorizationPasswordReInput') {
        retry = true
      }
      return new Promise((resolve) => {
        this._passwdCallback = resolve
        this.stateCallback(STATUS.WAITING_PASSWD, { hint, retry })
      })
    }
    return null
  }

  _update(args) {} // eslint-disable-line

  _error(error) {
    if (error.message === 'AUTH_KEY_UNREGISTERED') {
      this.logout()
    }
    this.stateCallback(STATUS.ERROR, error.message)
  }

  /**
   * @param {Function<Object, void>} callback
   */
  setMessageCallback(callback) {
    if (typeof callback !== 'function') {
      throw new Errors.InvalidCallbackError('invalid callback type')
    }
    this._messageCallback = callback
  }

  /**
   * @param {string} code authorization code
   */
  sendAuthCode(code) {
    if (this._codeCallback !== undefined) {
      this._codeCallback(code)
      delete this._codeCallback
    }
  }

  /**
   * @param {string} password
   */
  sendPasswordCode(password) {
    if (this._passwdCallback !== undefined) {
      this._passwdCallback(password)
      delete this._passwdCallback
    }
  }

  getChats() {
    return this.client.tg.getAllChats()
  }

  logout() {
    fs.rmdirSync(path.resolve(__dirname, '__tglib__'))
  }

  destroy() {
    return this.client._destroy()
  }
}
