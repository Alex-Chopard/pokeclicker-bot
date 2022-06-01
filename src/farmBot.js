class FarmBot {
  isStarted = false
  farmModal = null
  observer = null

  init () {
    this.isStarted = false
    this.farmModal = null
    this.observer = null
  }

  async start () {
    if (this.isStarted) return console.warn('[FarmBot] Already started!')

    this.farmModal = document.querySelector('#farmModal')
    if (!this.farmModal) return console.error('[FarmBot] Unable to find farm modale!')

    await this.harvestAll()
    await this.plantAll()

    const plots = Array.from(this.farmModal.querySelectorAll('.plot'))
      .filter(plot => !plot.className.includes('plotLocked'))
    const plot = plots[0]

    const plotButton = plot.querySelector('.plotButton')
    this.observer = new MutationObserver(async (mutationsList) => {
      if (mutationsList.some(mutation => mutation.attributeName === 'src')) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await this.harvestAll()
        await this.plantAll()
      }
    })

    this.observer.observe(plotButton, { attributes: true, subtree: true })

    this.isStarted = true
  }

  stop () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    this.farmModal = null
    this.isStarted = false
  }

  async plantAll () {
    const btn = this.farmModal.querySelector('.btn[data-bind*="FarmController.selectedBerry()"]')
    if (btn) {
      btn.click()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  async harvestAll () {
    const btn = this.farmModal.querySelector('.btn[data-bind*="farming.harvestAll()"]')
    if (btn) {
      btn.click()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

export default FarmBot
