# Pockeclicker-bots

Provide bots to increase the speed of your progression in [PokéClicker](https://www.pokeclicker.com).

Bots availables
- auto clicker
- bot to clear a dungeon
- bot to clear gym
- bot to automatically fill the hatchery queue
- bot to automatically harverst/plante berries
- bot to automatically use bomb in the underground

### Usage
Run
```bash
npm run dev
```

Build the code
```bash
npm run build
```

Then, you need to manually copy-paste the code generated in /build/bundle.js inside the console of pokeclicker.

### Bots usages
#### Auto clicker
```js
_clickerBot.start()
_clickerBot.stop()
```

#### Dungeon bot
```js
_dungeonBot.start() // Clear the boss at the end
_dungeonBot.start(true) // Clear the boss when is tile is clickable
_dungeonBot.stop()
```

#### Gym bot
```js
_gymBot.start(0) // Clear the gym at index given
_gymBot.stop()
```

#### Hatchery bot
```js
_hatcheryBot.start() // Fill the hatchery queue (need to have open the hatchery once)
_hatcheryBot.start(false) // Open the hatchery and fill the hatchery queue (and re-open the hatchery the the queue need to be re-filled)
_hatcheryBot.stop()
```

#### Farm bot
```js
_farmBot.start()
_farmBot.stop()
```

#### Underground bot
```js
_undergroundBot.start()
_undergroundBot.stop()
```