const HATCHERY_QUEUE_COUNT = Object.freeze({
  KANTO: 0,
  JOHTO: 4,
  HOENN: 8,
  SINNOH: 16,
  UNOVA: 32,
  KALOS: 64,
  ALOLA: 96
})

class HatcheryBot {
  isStarted = false

  _breedingDisplay = null
  _observer = null

  init () {
    this.isStarted = false
    this._breedingDisplay = null
    this._observer = null
  }

  async start (openModal = false) {
    if (this.isStarted) return console.warn('[HatcheryBot] Already stared!')

    if (this._hatcheryQueueCount() === 0) return console.error('[HatcheryBot] Queue available only after Kanto!')

    this._breedingDisplay = document.querySelector('#breedingDisplay')
    if (!this._breedingDisplay) return console.error('[HatcheryBot] Unable to find breeding display!')

    await this._openModalToLoadPokemon()

    await this._addPokemonsToHatcheryQueue(openModal)

    this._observer = new MutationObserver((mutationsList) => {
      if (mutationsList.some(mutationList => Array.from(mutationList.removedNodes).some(node => node.id === 'hatcheryQueue'))) {
        this._addPokemonsToHatcheryQueue(openModal)
      }
    })

    this._observer.observe(this._breedingDisplay, { childList: true })

    this.isStarted = true
  }

  stop () {
    if (this._observer) {
      this._observer.disconnect()
      this._observer = null
    }

    this._breedingDisplay = null
    this.isStarted = false
  }

  async _addPokemonsToHatcheryQueue (openModal) {
    if (openModal) {
      await this._forceOpenModal()
    }

    const hatcheryQueueCount = this._hatcheryQueueCount()

    const eggs = Array.from(document.querySelectorAll('#breeding-pokemon .eggSlot:not([style*="display: none;"])'))
      .splice(0, hatcheryQueueCount)

    for (const egg of eggs) {
      const queue = document.querySelector('#hatcheryQueue')
      if (!queue || queue.childElementCount < hatcheryQueueCount) {
        const overlay = egg.querySelector('a.overlay')
        if (overlay) overlay.click()
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    }
  }

  async _forceOpenModal () {
    return new Promise((resolve => {
      const openButton = this._breedingDisplay.querySelector('.btn[data-bind*="BreedingController.openBreedingModal()"]')
      const modal = document.querySelector('#breedingModal')
      
      let observer = null
      let timeout = null

      const leave = () => {
        const closeButton = document.querySelector('#breedingModal button[data-dismiss="modal"]')
        if (closeButton) closeButton.click()
        if (timeout) clearTimeout(timeout)
        if (observer) observer.disconnect()
        resolve()
      }

      timeout = setTimeout(leave, 5000)

      observer = new MutationObserver(_ => {
        if (modal.style.display === 'block') {
          setTimeout(leave, 1000)
        }
      })
      observer.observe(modal, { attributes: true })
      openButton.click()
    }))
  }

  async _openModalToLoadPokemon () {
    return new Promise(resolve => {
      if (this._needToOpenModal()) {
        const openButton = this._breedingDisplay.querySelector('.btn[data-bind*="BreedingController.openBreedingModal()"]')
        const list = document.querySelector('ul[data-bind="foreach: PartyController.getHatcherySortedList()"]')
        
        let observer = null
        let timeout = null

        const leave = () => {
          const closeButton = document.querySelector('#breedingModal button[data-dismiss="modal"]')
          if (closeButton) closeButton.click()
          if (timeout) clearTimeout(timeout)
          if (observer) observer.disconnect()
          resolve()
        }

        timeout = setTimeout(leave, 5000)

        observer = new MutationObserver(_ => {
          if (!this._needToOpenModal()) leave()
        })
        observer.observe(list, { childList: true })

        openButton.click()
      } else {
        resolve()
      }
    })
  }

  _needToOpenModal () {
    const list = document.querySelector('ul[data-bind="foreach: PartyController.getHatcherySortedList()"]')
    return !list || list.childElementCount === 0
  }

  _hatcheryQueueCount () {
    const svg = document.querySelector('svg#map')
    const count = svg.childElementCount
    const keys = Object.keys(HATCHERY_QUEUE_COUNT)
    const key = count <= keys.length
      ? keys[count - 1]
      : keys[keys.length - 1]
    return HATCHERY_QUEUE_COUNT[key]
  }
}

export default HatcheryBot
