class AutoClicker {
  battleIndex = 0
  isStared = false
  battleView = null
  observer = null
  interval = null
  intervalLoopTime = null

  constructor (index = 0) {
    this.battleIndex = index
  }

  init () {
    this.isStared = false
    this.battleView = null
    this.observer = null
    this.interval = null
    this.intervalLoopTime = 1

    const battleViews = document.querySelectorAll('#battleContainer .battle-view .row.justify-content-center.no-gutters')
    if (battleViews.length <= this.battleIndex) return console.warn(`[AutoClicker] Missing batle view, given index: ${this.battleIndex}, for array length: ${battleViews.length}`)
    this.battleView = battleViews[this.battleIndex]
  }

  start () {
    if (!this.isStared) {
      // Initial start.
      this.init()

      this.interval = setInterval(this.clickOnBattleArea.bind(this), this.intervalLoopTime)

      this.observer = new MutationObserver((mutationsList) => {
        if (mutationsList.some(mutation => Array.from(mutation.removedNodes).some(node => node.className = 'col no-gutters clickable'))) {
          // Leave battle area
          clearInterval(this.interval)
        } else if (mutationsList.some(mutation => Array.from(mutation.addedNodes).some(node => node.className = 'col no-gutters clickable'))) {
          // Enter battle area
          if (this.interval) {
            clearInterval(this.interval)
            this.interval = null
          }

          this.interval = setInterval(this.clickOnBattleArea.bind(this), this.intervalLoopTime)
        }
      })

      this.observer.observe(this.battleView, { childList: true })

      this.isStared = true
    } else {
      console.warn('[AutoClicker] Auto clicker already started!')
    }
  }

  stop () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }

    this.isStared = false
  }

  clickOnBattleArea () {
    if (!this.battleView) return
    const battleArea = this.battleView.querySelector('.col.no-gutters.clickable')
    if (battleArea) {
      battleArea.click()
    }
  }
}

export default AutoClicker
