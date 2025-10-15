# CodeQuest: The Lost Data Realms

A 5-level educational Phaser.js game teaching Data Structures and Algorithms (DSA) concepts through interactive gameplay.

## 🎮 Game Overview

**Story**: You are a Data Explorer tasked with restoring the corrupted Digital Realm by collecting 3 Data Keys through fixing broken DSA concepts.

**Gameplay Time**: 5-7 minutes  
**Target Audience**: Students learning DSA fundamentals  
**Technology**: Phaser.js 3.70.0

---

## 📚 Levels

### Level 1: Digital Awakening (Intro)
- **Concept**: Introduction to the game world
- **Gameplay**: Story dialogue with typewriter effect
- **Learning**: Sets the context for the DSA journey
- **Duration**: ~30 seconds

### Level 2: Array Realm
- **Concept**: Arrays and Sorting
- **Gameplay**: Drag-and-drop puzzle
- **Learning**: Understanding array indexing and ordering
- **Task**: Arrange elements [10, 20, 30, 40, 50] in correct ascending order
- **Reward**: Data Key 1

### Level 3: Stack Summit
- **Concept**: Stack (LIFO - Last In, First Out)
- **Gameplay**: Interactive push/pop simulation
- **Learning**: Stack operations and LIFO principle
- **Task**: Push 5 crates, then pop 2 crates
- **Reward**: Data Key 2

### Level 4: Queue Quarters
- **Concept**: Queue (FIFO - First In, First Out)
- **Gameplay**: Passenger enqueue/dequeue simulation
- **Learning**: Queue operations and FIFO principle
- **Task**: Enqueue 3 passengers, then dequeue 3
- **Reward**: Data Key 3

### Level 5: Core Simulator (Revision)
- **Concept**: Combined DSA review
- **Gameplay**: Three mini-tasks combining all concepts
- **Learning**: Reinforcement of arrays, stacks, and queues
- **Tasks**:
  1. Sort array [3, 1, 2] by swapping elements
  2. Push one item to stack
  3. Dequeue one item from queue
- **Reward**: System restoration + victory animation with glowing orb

---

## 🚀 How to Run

### Option 1: Standalone HTML (Recommended for Testing)
1. Open `codequest-game.html` in a web browser
2. The game will load automatically
3. Click "START QUEST" to begin

### Option 2: Integration with CodeVerse Platform
1. Include the game script in your main HTML:
   ```html
   <script src="games/dsa/codequest-lost-data-realms.js"></script>
   ```
2. Create a container div:
   ```html
   <div id="game-container"></div>
   ```
3. The game will initialize automatically

---

## 🎯 Game Controls

- **Mouse**: Primary input device
- **Click**: Interact with buttons and UI elements
- **Drag**: Move elements in Level 2 (Array Realm)
- **Hover**: Visual feedback on interactive elements

### Level-Specific Controls:

**Level 2 (Array Realm)**:
- Drag numbers to empty slots
- Drop near a slot to snap into place
- All slots must be filled to check solution

**Level 3 (Stack Summit)**:
- Click "PUSH" to add crates to stack
- Click "POP" to remove top crate
- Must push 5 before popping

**Level 4 (Queue Quarters)**:
- Click "ENQUEUE" to add passengers to rear
- Click "DEQUEUE" to remove from front
- Maximum 3 passengers at once

**Level 5 (Core Simulator)**:
- **Array Task**: Click two numbers to swap them, then click "Check"
- **Stack Task**: Click "PUSH" to add item
- **Queue Task**: Click "DEQUEUE" to remove item

---

## 🎨 Visual Features

- **Scene Transitions**: Smooth fade in/out between levels
- **Animations**: 
  - Typewriter effect for story text
  - Pulse animations on buttons
  - Drag-and-drop with snap-to-grid
  - Particle effects in victory scene
- **Color Coding**:
  - Green (#00ff88): Success/Start
  - Gold (#ffd700): Important info/Arrays
  - Red (#ff6b6b): Stack operations
  - Cyan (#4ecdc4): Queue operations
  - Cyan glow (#00ffff): Final level

---

## 📝 Code Structure

```
games/dsa/
├── codequest-lost-data-realms.js  # Main game code (1027 lines)
├── codequest-game.html            # Standalone HTML runner
└── README.md                      # This file
```

### Game Architecture:

```javascript
// 5 Phaser Scene Classes
- Level1_DigitalAwakening
- Level2_ArrayRealm
- Level3_StackSummit
- Level4_QueueQuarters
- Level5_CoreSimulator

// Game Configuration
- 800x600 resolution
- Arcade physics
- Auto-scaling
```

---

## 🔧 Customization Guide

### Modify Difficulty:

**Level 2 (Array)**:
```javascript
// Line 96: Change array size and values
this.correctOrder = [10, 20, 30, 40, 50]; // Make longer/shorter
```

**Level 3 (Stack)**:
```javascript
// Lines 257-258: Adjust push/pop requirements
this.targetPushes = 5;  // Increase for more pushes
this.targetPops = 2;    // Increase for more pops
```

**Level 4 (Queue)**:
```javascript
// Line 445: Change queue capacity
if (this.queue.length >= 3) // Increase max queue size
```

### Change Visual Theme:

```javascript
// Background colors (in each scene's create() method)
this.add.rectangle(400, 300, 800, 600, 0x1a1a2e); // Change hex color
```

### Adjust Timing:

```javascript
// Typewriter speed (Level 1, line 51)
delay: 30,  // Lower = faster typing

// Scene transition duration (throughout)
this.cameras.main.fadeOut(500);  // Milliseconds
```

---

## 🎓 Educational Value

### Learning Outcomes:

1. **Arrays**: Understanding indexing, ordering, and sorting
2. **Stacks**: LIFO principle, push/pop operations
3. **Queues**: FIFO principle, enqueue/dequeue operations
4. **Problem Solving**: Applying concepts to solve challenges
5. **Visual Learning**: Seeing data structures in action

### Pedagogical Features:

- **Progressive Difficulty**: Each level builds on previous knowledge
- **Immediate Feedback**: Visual confirmation of correct/incorrect actions
- **Gamification**: Points, keys, and rewards motivate learning
- **Hands-On Practice**: Interactive rather than passive learning
- **Revision**: Final level reinforces all concepts

---

## 🐛 Known Limitations

1. **Particle System**: Requires texture generation (handled automatically)
2. **Mobile Support**: Optimized for desktop; touch controls may need adjustment
3. **Browser Compatibility**: Requires modern browser with Canvas support
4. **No Save System**: Progress resets on page reload

---

## 🔮 Future Enhancements

Potential additions for expanded version:

- [ ] Add more DSA concepts (Linked Lists, Trees, Graphs)
- [ ] Implement scoring system with leaderboard
- [ ] Add difficulty levels (Easy/Medium/Hard)
- [ ] Include sound effects and background music
- [ ] Add mobile touch controls
- [ ] Implement save/load progress
- [ ] Add multiplayer competitive mode
- [ ] Include code snippets showing actual implementation
- [ ] Add timed challenges for advanced players
- [ ] Integrate with CodeVerse progress tracking

---

## 📄 License

Part of the CodeVerse educational platform.

---

## 👨‍💻 Technical Details

**Dependencies**:
- Phaser.js 3.70.0 (loaded via CDN)

**Browser Requirements**:
- HTML5 Canvas support
- JavaScript ES6+
- Recommended: Chrome, Firefox, Safari, Edge (latest versions)

**Performance**:
- Target: 60 FPS
- Memory: ~50MB
- Load Time: <2 seconds

---

## 🎯 Integration with CodeVerse

To integrate this game as DSA Course Level 5:

1. Add game link to course navigation
2. Track completion in user progress
3. Award points/badges upon completion
4. Link to related DSA theory content
5. Provide "Try Again" option for practice

---

**Created**: 2024  
**Version**: 1.0.0  
**Game Type**: Educational Puzzle/Simulation  
**Platform**: Web (Phaser.js)
