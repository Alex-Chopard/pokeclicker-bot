
class UndergroundBot {
  isStarted = false
  observer = null
  mineModal = null

  init () {
    this.isStarted = false
    this.observer = null
    this.mineModal = null
  }

  start () {
    if (this.isStarted) return console.warn('[UndergroundBot] Already stared!')

    this.mineModal = document.querySelector('#mineModal')
    if (!this.mineModal) return console.error('[UndergroundBot] Unable to find mine modal!')

    const mineEnergyBar = this.mineModal.querySelector('#mineEnergyBar')
    if (!mineEnergyBar) return console.error('[UndergroundBot] Unable to find energy bar!')

    this.observer = new MutationObserver((mutationsList) => {
      if (mutationsList.some(mutation => mutation.attributeName === 'style')) {
        this.clickOnBomb()
      }
    })

    this.observer.observe(mineEnergyBar, { attributes: true })

    this.clickOnBomb()

    this.isStarted = true
  }

  stop () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    this.mineModal = null
    this.isStarted = false
  }

  clickOnBomb () {
    const btn = this.mineModal.querySelector('.btn[onclick="Mine.bomb()"]')
    if (btn) btn.click()
  }
}

export default UndergroundBot
