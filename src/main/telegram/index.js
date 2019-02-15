import {
  Client,
  Errors
} from 'tglib'

const api = {
  appId: 736927,
  apiHash: 'd46fc613e06362d96df73308b4a6e7e4'
}

export const STATUS = Object.freeze({
  LOGIN_SUCCESS: 0,
  WAITING_CODE: 1,
  ERROR: 2
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
    this.client.registerCallback('td:getInput', this._getInput)
    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      this.client.registerCallback('td:update', update => console.log(update))
      this.client.registerCallback('td:error', error => console.error(error))
      /* eslint-enable no-console */
    }
    this.client.ready.then(() => this.stateCallback(STATUS.LOGIN_SUCCESS))
  }

  // eslint-disable-next-line no-unused-vars
  async _getInput({
    type,
    string,
    extras: {
      hint
    } = {}
  }) {
    if (type === 'input') {
      let status = null
      switch (string) {
        case 'AuthorizationAuthCodeInput':
          status = STATUS.WAITING_CODE
          break
        case 'AuthorizationFirstNameInput':
          status = STATUS.ERROR
          break
        default:
          break
      }
      if (status !== null) {
        return new Promise((resolve) => {
          this._codeCallback = resolve
          this.stateCallback(status)
        })
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`%cTelegram %c${type}[${string}]${hint != null ? `<${hint}>` : ''}`, 'color: orange;', 'color: red;')
    }
    return null
  }

  /**
   * @param {Function<number, void>} callback
   * @see STATUS
   */
  setStateCallback(callback) {
    this.stateCallback = callback
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
}
