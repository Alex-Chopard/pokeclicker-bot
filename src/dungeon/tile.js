class Tile {
  element = null
  y = null
  x = null

  constructor (element, y, x) {
    this.element = element
    this.y = y
    this.x = x
  }

  click () {
    this.element.click()
  }
 
  hasClass (className) {
    return this.element.className.includes(className)
  }

  hasOneClass (classNames) {
    return classNames.some(className => this.hasClass(className))
  }

  isEquals (tile) {
    return tile && tile instanceof Tile && tile.hashCode() === this.hashCode()
  }

  hashCode () {
    return `${this.y}-${this.x}`
  }
}

export default Tile
