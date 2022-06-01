
class HatcheryBot {
  isStarted = false
  breedingDisplay = null
  observer = null

  init () {
    this.isStarted = false
    this.breedingDisplay = null
    this.observer = null
  }

  start (openModal = true) {
    if (this.isStarted) return console.warn('[HatcheryBot] Already stared!')

    this.breedingDisplay = document.querySelector('#breedingDisplay')
    if (!this.breedingDisplay) return console.error('[HatcheryBot] Unable to find breeding display!')

    this.addPokemonsToHatcheryQueue(openModal)

    this.observer = new MutationObserver((mutationsList) => {
      if (mutationsList.some(mutationList => Array.from(mutationList.removedNodes).some(node => node.id === 'hatcheryQueue'))) {
        this.addPokemonsToHatcheryQueue(openModal)
      }
    })

    this.observer.observe(this.breedingDisplay, { childList: true })

    this.isStarted = true
  }

  stop () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.breedingDisplay = null

    this.isStarted = false
  }

  async addPokemonsToHatcheryQueue (openModal) {
    if (openModal) {
      const btn = this.breedingDisplay.querySelector('.btn[data-bind*="BreedingController.openBreedingModal()"]')
      if (btn) btn.click()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const eggs = Array.from(document.querySelectorAll('#breeding-pokemon .eggSlot'))
    for (const egg of eggs) {
      const queue = document.querySelector('#hatcheryQueue')
      if (!queue || queue.childElementCount < 8) {
        if (egg.style.display !== 'none') {
          const overlay = egg.querySelector('a.overlay')
          if (overlay) overlay.click()
        }
        await new Promise((resolve) => setTimeout(resolve, 1))
      }
    }

    const queue = document.querySelector('#hatcheryQueue')
    if (!queue || queue.childElementCount.length < 8) {
      await this.addPokemonsToHatcheryQueue(openModal)
    }
  }
}

export default HatcheryBot
