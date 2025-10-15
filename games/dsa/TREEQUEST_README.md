# TreeQuest: Guardians of the Forest

A 5-level educational Phaser.js game teaching Tree Data Structures through interactive gameplay.

## 🌳 Game Overview

**Story**: You are a Data Explorer tasked with restoring the corrupted Digital Forest by mastering tree concepts through 5 interactive levels.

**Gameplay Time**: 5-7 minutes  
**Target Audience**: Students learning Trees, BST, AVL, and Traversals  
**Technology**: Phaser.js 3.70.0

---

## 📚 Levels

### Level 1: The Forest Awakens (Tree Basics)
- **Concept**: Introduction to tree structure
- **Gameplay**: Click on nodes to learn their meanings
- **Learning**: Root, children, leaves, parent-child relationships
- **Task**: Explore 3 different node types
- **Duration**: ~1 minute

### Level 2: The Path of Traversal (Tree Traversals)
- **Concept**: Tree Traversal Algorithms
- **Gameplay**: Click nodes in correct traversal order
- **Learning**: Inorder, Preorder, Postorder sequences
- **Task**: Complete all 3 traversal modes correctly
- **Duration**: ~1.5 minutes

### Level 3: The Binary Grove (Binary Search Trees)
- **Concept**: Binary Search Tree properties
- **Gameplay**: Drag-and-drop numbers to build BST
- **Learning**: BST property (Left < Root < Right)
- **Task**: Place 7 numbers correctly to form valid BST
- **Duration**: ~1.5 minutes

### Level 4: The Balanced Domain (AVL Trees)
- **Concept**: Self-balancing trees and rotations
- **Gameplay**: Perform rotations to balance tree
- **Learning**: Balance factor, left/right rotations
- **Task**: Choose correct rotation to balance unbalanced tree
- **Duration**: ~1 minute

### Level 5: The Digital Canopy (Final Revision)
- **Concept**: Combined review of all tree concepts
- **Gameplay**: Complete 4 mini-tasks
- **Learning**: Reinforcement of all previous concepts
- **Tasks**:
  1. Identify root node
  2. Choose correct traversal result
  3. Place number in correct BST position
  4. Select correct rotation type
- **Reward**: Forest restoration + glowing tree animation
- **Duration**: ~1.5 minutes

---

## 🚀 How to Run

### Option 1: Standalone HTML
1. Open `treequest-game.html` in a web browser
2. The game will load automatically
3. Click through the levels

### Option 2: Integration with CodeVerse Platform
1. Game is referenced in DSA Level 10 configuration
2. Opens automatically when user reaches Level 10
3. Embedded via iframe in level manager

---

## 🎯 Game Controls

- **Mouse**: Primary input device
- **Click**: Select nodes, buttons, and options
- **Drag**: Move numbers in Level 3 (BST building)
- **Hover**: Visual feedback on interactive elements

### Level-Specific Controls:

**Level 1 (Forest Awakens)**:
- Click on ROOT, LEFT, RIGHT, and LEAF nodes to learn

**Level 2 (Path of Traversal)**:
- Click nodes in correct sequence for each traversal mode
- Switch between Inorder, Preorder, Postorder modes
- Use RESET button to try again

**Level 3 (Binary Grove)**:
- Drag numbers from bottom to tree slots
- Drop near a slot to snap into place
- Click CHECK BST to validate

**Level 4 (Balanced Domain)**:
- Click Left Rotation or Right Rotation buttons
- Choose correct rotation to balance the tree

**Level 5 (Digital Canopy)**:
- Complete 4 quick tasks by clicking correct options
- Each task tests a different tree concept

---

## 🎨 Visual Features

- **Scene Transitions**: Smooth fade in/out between levels
- **Animations**: 
  - Pulse effects on buttons
  - Drag-and-drop with snap-to-grid
  - Particle effects in victory scene
  - Glowing tree animation in finale
- **Color Coding**:
  - Green (#7cfc00): Primary theme/success
  - Gold (#ffd700): Important info/selected items
  - Red (#ff6b6b): Errors/wrong answers
  - Dark green backgrounds: Forest theme

---

## 📝 Code Structure

```
games/dsa/
├── treequest-guardians.js     # Main game code (~600 lines)
├── treequest-game.html        # Standalone HTML runner
└── TREEQUEST_README.md        # This file
```

### Game Architecture:

```javascript
// 5 Phaser Scene Classes
- Level1_ForestAwakens
- Level2_PathOfTraversal
- Level3_BinaryGrove
- Level4_BalancedDomain
- Level5_DigitalCanopy

// Game Configuration
- 800x600 resolution
- Arcade physics
- Auto-scaling
```

---

## 🎓 Educational Value

### Learning Outcomes:

1. **Tree Structure**: Understanding hierarchical data organization
2. **Traversals**: Mastering Inorder, Preorder, Postorder, and Level Order
3. **BST**: Learning binary search tree properties and construction
4. **AVL Trees**: Understanding self-balancing and rotations
5. **Problem Solving**: Applying tree concepts to solve challenges

### Pedagogical Features:

- **Progressive Difficulty**: Each level builds on previous knowledge
- **Immediate Feedback**: Visual confirmation of correct/incorrect actions
- **Gamification**: Story narrative and rewards motivate learning
- **Hands-On Practice**: Interactive rather than passive learning
- **Revision**: Final level reinforces all concepts

---

## 🔧 Customization Guide

### Modify Difficulty:

**Level 2 (Traversals)**:
```javascript
// Line 200: Change tree structure
this.correctSequences = {
    'inorder': [4, 2, 5, 1, 3],  // Modify sequence
    // Add more nodes for harder challenge
};
```

**Level 3 (BST)**:
```javascript
// Line 350: Change numbers to place
this.numbers = [50, 30, 70, 20, 40, 60, 80]; // Add/remove numbers
```

### Change Visual Theme:

```javascript
// Background colors (in each scene's create() method)
this.add.rectangle(400, 300, 800, 600, 0x1a4d2e); // Change hex color
```

---

## 🐛 Known Limitations

1. **Particle System**: Requires texture generation (handled automatically)
2. **Mobile Support**: Optimized for desktop; touch controls may need adjustment
3. **Browser Compatibility**: Requires modern browser with Canvas support
4. **No Save System**: Progress resets on page reload

---

## 🎯 Integration with CodeVerse

To integrate this game as DSA Course Level 10:

1. ✅ Game link added to Level 10 configuration
2. ✅ Loads in iframe within level manager
3. ✅ Manual completion button for progression
4. ✅ Awards 200 XP upon completion
5. ✅ Links to Level 11 after completion

---

**Created**: 2024  
**Version**: 1.0.0  
**Game Type**: Educational Puzzle/Simulation  
**Platform**: Web (Phaser.js)  
**Course**: DSA Level 10 (Milestone)
