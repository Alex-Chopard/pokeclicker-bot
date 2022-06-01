import Tile from "./tile"

class DungeonMapHelper {
  tilesMap = []

  constructor () {
    this.tilesMap = []

    this.buildTilesMap()
  }

  buildTilesMap () {
    const lines = Array.from(document.querySelectorAll('.dungeon-board tr'))
    this.tilesMap = lines.map((line, y) => {
      const tiles = Array.from(line.querySelectorAll('td'))
      return tiles.map((tile, x) => new Tile(tile, y, x))
    })
  }

  getAvailableTiles () {
    let availbaleTiles = []
    for (const line of this.tilesMap) {
      for (const tile of line) {
        if (tile.hasOneClass(['tile-player', 'tile-entrance', 'tile-visited'])) {
          if (availbaleTiles.every(t => !t.isEquals(tile))) {
            availbaleTiles.push(tile)
          }
          const nearTiles = this.getTilesNearOf(tile)
          nearTiles.forEach(nearTile => {
            if (availbaleTiles.every(t => !t.isEquals(nearTile))) {
              availbaleTiles.push(nearTile)
            }
          })
        }
      }
    }
    return availbaleTiles.filter(tile =>
      !tile.hasOneClass(['tile-player', 'tile-entrance']) &&
      (!tile.hasClass('tile-visited') || tile.hasOneClass(['tile-enemy', 'tile-chest', 'tile-boss']))
    )
  }

  getTilesNearOf (tile) {
    return [
      this.getTileAtPosition(tile.y - 1, tile.x),
      this.getTileAtPosition(tile.y, tile.x + 1),
      this.getTileAtPosition(tile.y + 1, tile.x),
      this.getTileAtPosition(tile.y, tile.x - 1)
    ].filter(tile => !!tile)
  }

  getTileAtPosition (y, x) {
    if (y < 0 || y >= this.tilesMap.length) return null
    const line = this.tilesMap[y]
    if (!line || x < 0 || x >= line.length) return null
    return line[x]
  }
}

export default DungeonMapHelper
