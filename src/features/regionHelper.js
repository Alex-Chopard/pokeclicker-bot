import { v4 as uuidv4 } from 'uuid';

class RegionHelper {
  observer = null
  currentRegion = null

  _selector = '#townMap div[href="#mapBody"]'
  _titleElement = null
  _listeners = []

  initialize () {
    this._titleElement = document.querySelector(this._selector)
    if (!this._titleElement) console.error('Map not found!')

    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    this.observer = new MutationObserver(this._findRegion.bind(this))
    this.observer.observe(this._titleElement, { childList: true, characterData: true, subtree: true })

    this._findRegion()
  }

  addListener (callback) {
    if (typeof callback !== 'function') throw Error('Not a function')

    const id = uuidv4()
    this._listeners.push({ id, callback })

    return id
  }

  removeListener (id) {
    if (!id) throw Error('Missing id')
    const index = this._listeners.findIndex(listener => listener.id === id)
    if (index >= 0) {
      this._listeners.splice(index, 1)
    }
  }

  _findRegion () {
    if (!this._titleElement) return

    const text = this._titleElement.textContent
    if (!text) return

    const matches = text.match(/\((.*)\)/)
    if (matches && matches.length > 0 && matches[1]) {
      this.currentRegion = matches[1].trim()
      if (this._listeners && this._listeners.length > 0) {
        this._listeners.forEach(listener => listener.callback(this.currentRegion))
      }
      console.info('[RegionHelper] Region: ', this.currentRegion)
    }
  }
}

export default RegionHelper
