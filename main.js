import AutoClicker from './src/autoClicker.js'
import DungeonBot from './src/dungeon/dungeonBot.js'
import HatcheryBot from './src/hatcheryBot.js'
import UndergroundBot from './src/undergroundBot.js'
import FarmBot from './src/farmBot.js'
import GymBot from './src/gymBot.js'
import RegionHelper from './src/features/regionHelper'

console.log('Staring bot');

if (_clickerBot) {
  _clickerBot.stop()
}

if (_dungeonBot) {
  _dungeonBot.stop()
}

if (_dungeonBotLegit) {
  _dungeonBotLegit.stop()
}

if (_hatcheryBot) {
  _hatcheryBot.stop()
}

if (_undergroundBot) {
  _undergroundBot.stop()
}

if (_farmBot) {
  _farmBot.stop()
}

if (_gymBot) {
  _gymBot.stop()
}

var _clickerBot = new AutoClicker()
_clickerBot.init()
var _dungeonBot = new DungeonBot()
_dungeonBot.init()
var _dungeonBotLegit = new DungeonBot(false)
_dungeonBotLegit.init()
var _hatcheryBot = new HatcheryBot()
_hatcheryBot.init()
var _undergroundBot = new UndergroundBot()
_undergroundBot.init()
var _farmBot = new FarmBot()
_farmBot.init()
var _gymBot = new GymBot()
_gymBot.init()

var _regionHelper = new RegionHelper()
_regionHelper.initialize()
