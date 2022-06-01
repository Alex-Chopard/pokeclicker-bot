import AutoClicker from './autoClicker.js'

class GymBot {
  isStarted = false
  observer = null
  townView = null
  autoClickerInstance = null

  init () {
    this.isStarted = false
    this.observer = null
    this.townView = null

    this.autoClickerInstance = new AutoClicker(2) // Gyn Battles
    this.autoClickerInstance.init()
  }

  start (index = 0) {
    if (this.isStarted) return console.error('[GymBot] Already started!')

    this.townView = document.querySelector('#battleContainer .battle-view knockout[data-bind*="GameConstants.GameState.town"]')
    if (!this.townView) return console.error('[GymBot] Unable to find town view!')

    this.startGym(index)

    this.autoClickerInstance.start()

    this.observer = new MutationObserver((mutationsList) => {
      if (mutationsList.some(mutation => Array.from(mutation.addedNodes).some(node => node.firstElementChild && !!node.firstElementChild.parentElement.querySelector('.btn-group button[data-bind*="Total Clears: ${$data.clears()}"]')))) {
        // Enter and start gym
        this.startGym(index)
      }
    })

    this.observer.observe(this.townView, { childList: true })

    this.isStarted = true
  }

  stop () {
    this.autoClickerInstance.stop()

    if (this.observer) {
      this.observer.disconnect()
      this.oberver = null
    }

    this.townView = null
    this.isStarted = false
  }

  startGym (index) {
    const btns = Array.from(this.townView.querySelectorAll('.btn-group button[data-bind*="Total Clears: ${$data.clears()}"]'))
    if (btns.length > index) {
      btns[index].click()
    }
  }
}

export default GymBot
