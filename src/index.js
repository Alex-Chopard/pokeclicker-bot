import AutoClicker from './autoClicker.js'
import DungeonBot from './dungeon/dungeonBot.js'
import HatcheryBot from './hatcheryBot.js'
import UndergroundBot from './undergroundBot.js'
import FarmBot from './farmBot.js'
import GymBot from './gymBot.js'

console.log('Staring bot');
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

console.log('test')