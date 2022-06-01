import AutoClicker from '../autoClicker.js'
import DungeonMapHelper from './dungeonMapHelper.js'

class DungeonBot {
  autoClickerInstance = null
  isStarted = false
  observer = null
  observerMap = null
  observeTile = null
  observeBattle = null
  interval = null
  useAutoClicker = true

  constructor (useAutoClicker = true) {
    this.useAutoClicker = useAutoClicker
  }

  init () {
    this.isStarted = false
    this.observer = null
    this.observerMap = null
    this.observeTile = null
    this.observeBattle = null
    this.interval = null

    this.autoClickerInstance = new AutoClicker(1) // Dongeon Battles
    this.autoClickerInstance.init()
  }

  start (fast = false) {
    if (!this.isStarted) {

      this.startClearDungeon(fast)

      const battleView = document.querySelector('#battleContainer .battle-view>knockout')
      this.observer = new MutationObserver((mutationsList) => {
        if (mutationsList.some(mutation => Array.from(mutation.addedNodes).some(node => node.firstElementChild && !!node.firstElementChild.parentElement.querySelector('.btn[onclick*="DungeonRunner.initializeDungeon"]')))) {
          // Enter dungeon area
          this.startClearDungeon(fast)
        }
      })

      this.observer.observe(battleView, { childList: true })

      this.isStarted = true
      console.log('[DungeonBot] Starting')
    } else {
      console.warn('[DungeonBot] Dungeon bot already started!')
    }
  }

  stop () {
    this.autoClickerInstance.stop()

    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    if (this.observerMap) {
      this.observerMap.disconnect()
      this.observerMap = null
    }

    if (this.observeTile) {
      this.observeTile.disconnect()
      this.observeTile = null
    }

    if (this.observeBattle) {
      this.observeBattle.disconnect()
      this.observeBattle = null
    }

    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }

    this.isStarted = false
    console.log('[DungeonBot] Stopped')
  }

  startClearDungeon (fast) {
    const middleColumn = document.querySelector('#middle-column')

    this.autoClickerInstance.stop()
    if (this.observerMap) {
      this.observerMap.disconnect()
      this.observerMap = null
    }

    this.observerMap = new MutationObserver((mutationsList) => {
      if (mutationsList.some(mutation => Array.from(mutation.removedNodes).some(node => node.id === 'dungeonMap'))) {
        // Leave dungeon area
        if (this.observerMap) {
          this.observerMap.disconnect()
          this.observerMap = null
        }
    
        if (this.interval) {
          clearInterval(this.interval)
          this.interval = null
        }
      } else if (mutationsList.some(mutation => Array.from(mutation.addedNodes).some(node => node.id === 'dungeonMap'))) {
        // Enter dungeon area
        this.clear(fast)
      }
    })

    this.observerMap.observe(middleColumn, { childList: true })

    if (!this.enterDungeon()) {
      console.error('[DungeonBot] Unable to entre dungeon!')
      if (this.observerMap) {
        this.observerMap.disconnect()
        this.observerMap = null
      }
  
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
    }
  }

  enterDungeon () {
    const btn = document.querySelector('#battleContainer .battle-view>knockout .btn[onclick*="DungeonRunner.initializeDungeon"]')
    if (btn) {
      btn.click()
      return true
    }

    return false
  }

  clear (fast) {
    const dungeonMap = new DungeonMapHelper()

    if (this.observeTile) {
      this.observeTile.disconnect()
      this.observeTile = null
    }

    const availableTiles = dungeonMap.getAvailableTiles().reverse()

    let tile = null
    if (fast) {
      const boss = availableTiles.find(tile => tile.hasClass('tile-boss'))
      tile = boss || availableTiles[0]
    } else {
      const filteredTiles = availableTiles.filter(tile => !tile.hasOneClass(['tile-boss', 'tile-chest']))
      if (filteredTiles.length > 0) {
        tile = filteredTiles[0]
      } else {
        tile = availableTiles[0]
      }
    }

    const battleArea = this.autoClickerInstance.battleView.querySelector('.col.no-gutters.clickable')

    this.observeTile = new MutationObserver((mutationsList) => {
      if (mutationsList.some(mutationList => mutationList.type === 'attributes' && mutationList.attributeName === 'class' && mutationList.target && mutationList.target.className && mutationList.target.className.includes('tile-player'))) {
        if (!!battleArea.querySelector('div[data-bind*="if: DungeonBattle.enemyPokemon"]')) {
          // Fight enemies.
          this.fightEnemies(fast)
        } else if (!!battleArea.querySelector('.dungeon-chest')) {
          // Chest
          if (fast || dungeonMap.getAvailableTiles().every(tile => tile.hasOneClass(['tile-boss', 'tile-chest']))) {
            this.autoClickerInstance.clickOnBattleArea()
          }
          this.clear(fast)
        } else if (!!battleArea.querySelector('.dungeon-button')) {
          // Boss
          const tiles = dungeonMap.getAvailableTiles()
          if (fast || tiles.length === 0 || (tiles.length === 1 && tiles.some(tile => tile.hasClass('tile-boss')))) {
            this.autoClickerInstance.clickOnBattleArea()
            this.fightEnemies(fast)
          } else {
            this.clear(fast)
          }
        } else {
          this.clear(fast)
        }
      }
    })

    this.observeTile.observe(tile.element, { attributes: true })

    tile.click()
  }

  fightEnemies (fast) {
    if (this.observeBattle) {
      this.observeBattle.disconnect()
      this.observeBattle = null
    }

    const battleArea = this.autoClickerInstance.battleView.querySelector('.col.no-gutters.clickable')
    this.observeBattle =  new MutationObserver((mutationsList) => {
      if (mutationsList.some(mutationList => Array.from(mutationList.removedNodes).some(node => node.attributes && node.attributes[0] && node.attributes[0].value === 'if: DungeonBattle.enemyPokemon'))) {
        this.autoClickerInstance.stop()
        this.clear(fast)
      }
    })
    this.observeBattle.observe(battleArea, { childList: true })

    if (this.useAutoClicker) {
      this.autoClickerInstance.start()
    }
  }
}

export default DungeonBot
